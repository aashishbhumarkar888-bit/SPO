/**
 * AgriSeva Assistant Context & Grounding Engine
 * 
 * Injects verified live application state into Kisan Mitra,
 * preventing hallucinations and upholding AI Safety boundaries.
 */

import { FarmerProfile, AgriToken, ProcurementRecord, DbtTransaction, LanguageCode } from '../types';

export interface AssistantContextData {
  farmer: FarmerProfile;
  activeToken?: AgriToken;
  recentProcurement?: ProcurementRecord;
  recentDbt?: DbtTransaction;
  language: LanguageCode;
  selectedCentre?: {
    name: string;
    nameHi: string;
    villageOrTown: string;
    district: string;
    phone: string;
    operatingHours: string;
    distanceKm: number;
  };
}

export interface AssistantAnswer {
  text: string;
  intent: 'SLOT' | 'CENTRE' | 'QUEUE' | 'PAYMENT' | 'LAND' | 'MACHINERY' | 'WEATHER' | 'FAQ' | 'ACTION_CONFIRM';
  actionPrompt?: {
    actionType: 'CANCEL_BOOKING' | 'RESCHEDULE_BOOKING';
    confirmationText: string;
    tokenId: string;
  };
}

export class AssistantContextService {
  public static generateResponse(
    query: string, 
    context: AssistantContextData
  ): AssistantAnswer {
    const q = query.toLowerCase().trim();
    const isHi = context.language === 'hi';
    const { farmer, activeToken, recentProcurement, recentDbt, selectedCentre } = context;

    // 1. Centre Query ("Where is my centre?" / "केंद्र कहां है?")
    if (q.includes('centre') || q.includes('center') || q.includes('केंद्र') || q.includes('मंडी कहां') || q.includes('लोकेशन') || q.includes('location') || q.includes('पता')) {
      if (activeToken) {
        const text = isHi
          ? `आपका आवंटित केंद्र "${activeToken.centreNameHi}" है। संपर्क: 07152-245890। समय: प्रातः 08:30 से सायं 06:00 तक।`
          : `Your allocated centre is "${activeToken.centreName}". Phone: 07152-245890. Operating Hours: 08:30 AM to 06:00 PM.`;
        return { text, intent: 'CENTRE' };
      }
      if (selectedCentre) {
        const text = isHi
          ? `निकटतम केंद्र "${selectedCentre.nameHi}" (${selectedCentre.villageOrTown}, ${selectedCentre.district}) है, जो आपसे ${selectedCentre.distanceKm} किमी की दूरी पर है। हेल्पलाइन: ${selectedCentre.phone}।`
          : `Nearest centre is "${selectedCentre.name}" (${selectedCentre.villageOrTown}, ${selectedCentre.district}), approximately ${selectedCentre.distanceKm} km away. Helpline: ${selectedCentre.phone}.`;
        return { text, intent: 'CENTRE' };
      }
      const text = isHi
        ? 'केंद्र की विशिष्ट जानकारी वर्तमान में उपलब्ध नहीं है। कृपया केंद्र सूची देखें।'
        : 'Centre details are currently unavailable. Please check the service centres tab.';
      return { text, intent: 'CENTRE' };
    }

    // 2. Slot / Appointment Query
    if (q.includes('स्लॉट') || q.includes('slot') || q.includes('appointment') || q.includes('बुकिंग') || q.includes('कब आना है')) {
      if (activeToken) {
        const text = isHi
          ? `किसान श्री ${farmer.fullNameHi}, आपका स्लॉट "${activeToken.centreNameHi}" पर "${activeToken.scheduledTime}" के लिए निर्धारित है। टोकन नंबर: ${activeToken.tokenNumber}।`
          : `Farmer ${farmer.fullName}, your appointment at "${activeToken.centreName}" is scheduled for "${activeToken.scheduledTime}". Token Number: ${activeToken.tokenNumber}.`;
        return { text, intent: 'SLOT' };
      }
      const text = isHi
        ? 'वर्तमान में आपका कोई सक्रिय स्लॉट नहीं है। आप "मंडी स्लॉट" से नया स्लॉट बुक कर सकते हैं।'
        : 'You do not currently have an active slot booking. You can reserve one right now from the booking screen.';
      return { text, intent: 'SLOT' };
    }

    // 3. Queue Status Query
    if (q.includes('कतार') || q.includes('queue') || q.includes('नंबर') || q.includes('turn') || q.includes('वेटिंग') || q.includes('wait') || q.includes('position')) {
      if (activeToken) {
        const text = isHi
          ? `आपका टोकन ${activeToken.tokenNumber} है। स्थिति: "${activeToken.status}"। काउंटर: #${activeToken.counterAssigned}। आपसे आगे ${activeToken.peopleAhead} किसान हैं। अनुमानित प्रतीक्षा: लगभग ${activeToken.estimatedWaitMins} मिनट।`
          : `Your token is ${activeToken.tokenNumber}. Status: "${activeToken.status}" at Counter #${activeToken.counterAssigned}. There are ${activeToken.peopleAhead} farmers ahead of you. Estimated wait: ~${activeToken.estimatedWaitMins} minutes.`;
        return { text, intent: 'QUEUE' };
      }
      const text = isHi
        ? 'कतार की जानकारी वर्तमान में उपलब्ध नहीं है क्योंकि आपका कोई सक्रिय टोकन नहीं है।'
        : 'Queue position is currently unavailable because you do not have an active token.';
      return { text, intent: 'QUEUE' };
    }

    // 4. Payment / DBT Query
    if (q.includes('भुगतान') || q.includes('पैसा') || q.includes('payment') || q.includes('dbt') || q.includes('खाता') || q.includes('bank') || q.includes('utr')) {
      if (recentDbt) {
        const text = isHi
          ? `आपकी हालिया फसल उपार्जन का डीबीटी भुगतान ₹${recentDbt.amountInr.toLocaleString('en-IN')} बैंक खाता (${recentDbt.bankMasked}) में स्थिति "${recentDbt.status}" पर है। यूटीआर संदर्भ: ${recentDbt.utrNumber}।`
          : `Your recent procurement DBT payout of ₹${recentDbt.amountInr.toLocaleString('en-IN')} to account (${recentDbt.bankMasked}) is currently "${recentDbt.status}". UTR: ${recentDbt.utrNumber}.`;
        return { text, intent: 'PAYMENT' };
      }
      if (recentProcurement) {
        const text = isHi
          ? `तौल पर्ची #${recentProcurement.slipNumber} के लिए कुल देय राशि ₹${recentProcurement.totalGrossPayable.toLocaleString('en-IN')} है। डीबीटी स्थिति: ${recentProcurement.dbtStatus}।`
          : `For Weighbridge Slip #${recentProcurement.slipNumber}, net payable is ₹${recentProcurement.totalGrossPayable.toLocaleString('en-IN')}. DBT Status: ${recentProcurement.dbtStatus}.`;
        return { text, intent: 'PAYMENT' };
      }
      const text = isHi
        ? `पंजीकृत खाता (${farmer.bankAccount}, ${farmer.bankName}) डीबीटी हेतु सत्यापित है। कोई लंबित भुगतान नहीं है।`
        : `Registered account (${farmer.bankAccount}, ${farmer.bankName}) is verified for DBT. No pending payments.`;
      return { text, intent: 'PAYMENT' };
    }

    // 5. Land Records / 7-12 Query
    if (q.includes('जमीन') || q.includes('land') || q.includes('खसरा') || q.includes('7/12') || q.includes('रकबा') || q.includes('area')) {
      if (farmer.landParcels && farmer.landParcels.length > 0) {
        const parcels = farmer.landParcels.map(p => `खसरा ${p.khasraNumber} (${p.areaAcres} एकड़, ${p.primaryCrop})`).join(', ');
        const text = isHi
          ? `भूलेख 7/12 रिकॉर्ड अनुसार आपके नाम कुल ${farmer.landParcels.reduce((a, b) => a + b.areaAcres, 0)} एकड़ भूमि दर्ज है: ${parcels}।`
          : `According to Bhulekh 7/12 records, you have ${farmer.landParcels.reduce((a, b) => a + b.areaAcres, 0)} total acres registered: ${parcels}.`;
        return { text, intent: 'LAND' };
      }
      const text = isHi
        ? 'भूमि रिकॉर्ड की जानकारी वर्तमान में उपलब्ध नहीं है।'
        : 'Land records information is currently unavailable.';
      return { text, intent: 'LAND' };
    }

    // 5. Booking Cancellation intent (Enforces AI Safety Boundary: requires explicit farmer confirmation)
    if (q.includes('cancel') || q.includes('रद्द') || q.includes('हटाना') || q.includes('delete')) {
      if (activeToken) {
        const text = isHi
          ? `क्या आप वास्तव में अपना स्लॉट (टोकन ${activeToken.tokenNumber}) रद्द करना चाहते हैं? पुष्टि के लिए नीचे दिए गए बटन को दबाएं।`
          : `Do you want to cancel your booked slot (Token ${activeToken.tokenNumber})? Please confirm below to proceed safely.`;
        return {
          text,
          intent: 'ACTION_CONFIRM',
          actionPrompt: {
            actionType: 'CANCEL_BOOKING',
            confirmationText: isHi ? 'हाँ, स्लॉट रद्द करें' : 'Yes, Cancel Slot',
            tokenId: activeToken.id
          }
        };
      }
      const text = isHi
        ? 'रद्द करने के लिए कोई सक्रिय स्लॉट नहीं मिला।'
        : 'No active booking found to cancel.';
      return { text, intent: 'ACTION_CONFIRM' };
    }

    // 6. Default Knowledge / FAQ
    const text = isHi
      ? `नमस्ते श्री ${farmer.fullNameHi}, मैं आपका कृषि सेवा सहायक हूँ। आप मुझसे अपने टोकन, कतार की स्थिति, डीबीटी भुगतान, समर्थन मूल्य (MSP), या कस्टम हायरिंग ट्रैक्टर/ड्रोन के बारे में कभी भी पूछ सकते हैं। आपातकालीन सहायता हेतु 1800-180-1551 पर कॉल करें।`
      : `Hello Mr. ${farmer.fullName}, I am your AgriSeva Assistant. You can ask me about your booking token, live queue position, DBT payments, current MSP rates, or machinery rentals. For toll-free assistance, dial 1800-180-1551.`;
    return { text, intent: 'FAQ' };
  }
}
