import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RefreshCw, 
  BarChart3, 
  PieChart, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Sparkles, 
  Layers, 
  Scale, 
  TrendingUp, 
  Calendar,
  FileDown
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { playAudioChime } from '../../utils/speech';

interface DynamicExcelDashboardProps {
  language: LanguageCode;
  adminRole: 'supervisor' | 'superadmin';
}

interface ExcelRow {
  [key: string]: any;
}

export const DynamicExcelDashboard: React.FC<DynamicExcelDashboardProps> = ({
  language,
  adminRole
}) => {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'kpis' | 'charts' | 'table'>('kpis');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample procurement dataset generator
  const loadSampleDataset = () => {
    setIsLoading(true);
    setTimeout(() => {
      const sampleRows: ExcelRow[] = [
        { 'Token ID': 'T-101', 'Kisan ID': 'MH-WRD-8921', 'Farmer Name': 'Rameshwar Patil', 'Commodity': 'Soybean', 'Quantity (Qtl)': 65.5, 'Moisture (%)': 11.8, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 4892, 'Total Amount (₹)': 320426, 'Counter': 'Counter 1', 'Status': 'Completed', 'Date': '2026-09-14' },
        { 'Token ID': 'T-102', 'Kisan ID': 'MH-WRD-3342', 'Farmer Name': 'Sanjay Deshmukh', 'Commodity': 'Cotton', 'Quantity (Qtl)': 112.0, 'Moisture (%)': 15.2, 'Grade': 'Grade-B (Moisture Flag)', 'Rate (₹/Qtl)': 7122, 'Total Amount (₹)': 797664, 'Counter': 'Counter 2', 'Status': 'Weighbridge', 'Date': '2026-09-14' },
        { 'Token ID': 'T-103', 'Kisan ID': 'MH-WRD-9011', 'Farmer Name': 'Vasantrao Ghorpade', 'Commodity': 'Wheat', 'Quantity (Qtl)': 42.0, 'Moisture (%)': 10.4, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 2425, 'Total Amount (₹)': 101850, 'Counter': 'Counter 1', 'Status': 'Completed', 'Date': '2026-09-14' },
        { 'Token ID': 'T-104', 'Kisan ID': 'MH-WRD-7781', 'Farmer Name': 'Sunita Bai Shinde', 'Commodity': 'Soybean', 'Quantity (Qtl)': 88.0, 'Moisture (%)': 13.5, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 4892, 'Total Amount (₹)': 430496, 'Counter': 'Counter 3', 'Status': 'Quality Check', 'Date': '2026-09-15' },
        { 'Token ID': 'T-105', 'Kisan ID': 'MH-WRD-1190', 'Farmer Name': 'Prakash Ingle', 'Commodity': 'Chana', 'Quantity (Qtl)': 54.0, 'Moisture (%)': 12.0, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 5650, 'Total Amount (₹)': 305100, 'Counter': 'Counter 4', 'Status': 'Waiting', 'Date': '2026-09-15' },
        { 'Token ID': 'T-106', 'Kisan ID': 'MH-WRD-4521', 'Farmer Name': 'Dnyaneshwar Gawande', 'Commodity': 'Cotton', 'Quantity (Qtl)': 95.0, 'Moisture (%)': 14.8, 'Grade': 'Grade-B (Moisture Flag)', 'Rate (₹/Qtl)': 7122, 'Total Amount (₹)': 676590, 'Counter': 'Counter 2', 'Status': 'Completed', 'Date': '2026-09-15' },
        { 'Token ID': 'T-107', 'Kisan ID': 'MH-WRD-6632', 'Farmer Name': 'Anandrao Bhumarkar', 'Commodity': 'Tur / Arhar', 'Quantity (Qtl)': 38.5, 'Moisture (%)': 11.2, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 7550, 'Total Amount (₹)': 290675, 'Counter': 'Counter 3', 'Status': 'Completed', 'Date': '2026-09-15' },
        { 'Token ID': 'T-108', 'Kisan ID': 'MH-WRD-5509', 'Farmer Name': 'Kavita Jadhav', 'Commodity': 'Soybean', 'Quantity (Qtl)': 72.0, 'Moisture (%)': 12.1, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 4892, 'Total Amount (₹)': 352224, 'Counter': 'Counter 1', 'Status': 'Processing', 'Date': '2026-09-15' },
        { 'Token ID': 'T-109', 'Kisan ID': 'MH-WRD-2219', 'Farmer Name': 'Marotrao Kale', 'Commodity': 'Wheat', 'Quantity (Qtl)': 60.0, 'Moisture (%)': 11.0, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 2425, 'Total Amount (₹)': 145500, 'Counter': 'Counter 4', 'Status': 'Waiting', 'Date': '2026-09-15' },
        { 'Token ID': 'T-110', 'Kisan ID': 'MH-WRD-8812', 'Farmer Name': 'Balasaheb Kadam', 'Commodity': 'Maize', 'Quantity (Qtl)': 130.0, 'Moisture (%)': 12.9, 'Grade': 'Grade-A (FAQ)', 'Rate (₹/Qtl)': 2225, 'Total Amount (₹)': 289250, 'Counter': 'Counter 3', 'Status': 'Completed', 'Date': '2026-09-15' }
      ];

      setData(sampleRows);
      setColumns(Object.keys(sampleRows[0]));
      setFileName('Mandi_Procurement_Master_Sept2026.xlsx');
      setIsLoading(false);
      playAudioChime();
    }, 300);
  };

  // Handle local Excel file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const parsedData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

        if (parsedData.length > 0) {
          setData(parsedData);
          setColumns(Object.keys(parsedData[0]));
          playAudioChime();
        } else {
          alert('Uploaded sheet contains no readable rows.');
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Could not parse this file. Please ensure it is a valid .xlsx, .xls or .csv file.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Export current active data back to Excel
  const handleExportData = () => {
    if (data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ProcurementData');
    XLSX.writeFile(workbook, `AgriSeva_Export_${Date.now()}.xlsx`);
  };

  // Automatically detect key metrics
  const totalRecords = data.length;

  // Find quantity column
  const qtyCol = columns.find(c => /qty|quantity|weight|वजन|मात्रा|quintal/i.test(c));
  const totalQty = qtyCol
    ? data.reduce((acc, row) => acc + (parseFloat(row[qtyCol]) || 0), 0)
    : 0;

  // Find amount / price column
  const amtCol = columns.find(c => /amount|total|price|मूल्य|राशि|value|cost/i.test(c));
  const totalAmount = amtCol
    ? data.reduce((acc, row) => acc + (parseFloat(row[amtCol]) || 0), 0)
    : 0;

  // Find moisture column
  const moistureCol = columns.find(c => /moisture|नमी/i.test(c));
  const avgMoisture = moistureCol && totalRecords > 0
    ? (data.reduce((acc, row) => acc + (parseFloat(row[moistureCol]) || 0), 0) / totalRecords)
    : 0;

  // Find commodity column for grouping
  const commodityCol = columns.find(c => /commodity|crop|जिंस|फसल|item/i.test(c));
  const commodityBreakdown: { [key: string]: { count: number; qty: number } } = {};
  if (commodityCol) {
    data.forEach(row => {
      const comm = String(row[commodityCol] || 'Other');
      if (!commodityBreakdown[comm]) {
        commodityBreakdown[comm] = { count: 0, qty: 0 };
      }
      commodityBreakdown[comm].count += 1;
      if (qtyCol) {
        commodityBreakdown[comm].qty += (parseFloat(row[qtyCol]) || 0);
      }
    });
  }

  // Find counter column for load distribution
  const counterCol = columns.find(c => /counter|weighbridge|काउन्टर/i.test(c));
  const counterBreakdown: { [key: string]: number } = {};
  if (counterCol) {
    data.forEach(row => {
      const ctr = String(row[counterCol] || 'Unassigned');
      counterBreakdown[ctr] = (counterBreakdown[ctr] || 0) + 1;
    });
  }

  // Filtered rows for table view
  const filteredData = data.filter(row => {
    if (!searchQuery.trim()) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Top Banner & File Upload Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#063B2A] to-[#0B5D3B] text-white shadow-lg border border-[#168A5B]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {adminRole === 'superadmin' ? 'State Governance BI Engine' : 'Mandi Weighbridge Analytics'}
                </span>
                <span className="text-xs text-emerald-200">
                  SheetJS Auto-Parsing Active
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-display text-white">
                {language === 'hi' ? 'डायनामिक एक्सेल ऑटो-डैशबोर्ड' : 'Dynamic Excel & CSV Live Dashboard'}
              </h2>
              <p className="text-xs text-emerald-100/80">
                {language === 'hi' 
                  ? 'किसी भी उपार्जन एक्सेल/सीएसवी शीट को अपलोड करें, डैशबोर्ड मेट्रिक्स व चार्ट स्वतः तैयार होंगे' 
                  : 'Upload any APMC procurement spreadsheet; metrics, KPIs, and graphs generate automatically'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'hi' ? 'एक्सेल अपलोड करें' : 'Upload Excel / CSV'}</span>
            </button>

            <button
              type="button"
              onClick={loadSampleDataset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? 'नमूना डेटा लोड करें' : 'Load Sample Data'}</span>
            </button>

            {data.length > 0 && (
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/30 hover:bg-black/40 text-emerald-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{language === 'hi' ? 'निर्यात (Export)' : 'Export XLSX'}</span>
              </button>
            )}
          </div>
        </div>

        {fileName && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{language === 'hi' ? 'सक्रिय फाइल:' : 'Active File:'}</span>
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{fileName}</span>
              <span className="text-[11px] text-emerald-300">({totalRecords} {language === 'hi' ? 'पंक्तियां प्राप्त' : 'records loaded'})</span>
            </div>
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F0F5F2] dark:bg-[#143026] flex items-center justify-center text-[#168A5B]">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {language === 'hi' ? 'कोई एक्सेल शीट लोड नहीं है' : 'No Spreadsheet Loaded'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'अपने कंप्यूटर से कोई भी .xlsx या .csv फाइल चुनें अथवा तुरंत देखने हेतु "नमूना डेटा लोड करें" बटन दबाएं।'
                : 'Upload any procurement, weighbridge, or crop allotment spreadsheet, or click "Load Sample Data" to see dynamic generation.'}
            </p>
          </div>
          <button
            type="button"
            onClick={loadSampleDataset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B5D3B] hover:bg-[#063B2A] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'hi' ? 'उपार्जन नमूना एक्सेल लोड करें' : 'Load Sample Procurement Sheet'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#2B5E4A] pb-2">
            <button
              onClick={() => setActiveTab('kpis')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'kpis' 
                  ? 'bg-[#0B5D3B] text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-[#143026] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{language === 'hi' ? 'मुख्य मेट्रिक्स (KPI Overview)' : 'Key Metrics Overview'}</span>
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'charts' 
                  ? 'bg-[#0B5D3B] text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-[#143026] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{language === 'hi' ? 'जिंस व काउन्टर विश्लेषण' : 'Commodity & Counter Analytics'}</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'table' 
                  ? 'bg-[#0B5D3B] text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-[#143026] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'hi' ? 'कच्चा डेटा टेबल' : 'Raw Data Table'}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                {filteredData.length}
              </span>
            </button>
          </div>

          {/* TAB 1: Auto-Calculated KPIs */}
          {activeTab === 'kpis' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Entries */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold">{language === 'hi' ? 'कुल उपार्जन प्रविष्टियां' : 'Total Entries'}</span>
                    <Layers className="w-4 h-4 text-[#168A5B]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#063B2A] dark:text-white">
                    {totalRecords}
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                    {language === 'hi' ? 'सक्रिय मंडी आवक रिकॉर्ड' : 'Active Mandi inward records'}
                  </p>
                </div>

                {/* Total Quantity */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold">{language === 'hi' ? 'कुल तौल मात्रा' : 'Total Quantity'}</span>
                    <Scale className="w-4 h-4 text-[#168A5B]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#063B2A] dark:text-white">
                    {totalQty.toLocaleString('en-IN', { maximumFractionDigits: 1 })} <span className="text-sm font-sans font-medium text-slate-500">Qtl</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    ≈ {(totalQty / 10).toFixed(1)} Metric Tonnes
                  </p>
                </div>

                {/* Total Value */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold">{language === 'hi' ? 'कुल उपार्जन मूल्य' : 'Total Disbursed Value'}</span>
                    <TrendingUp className="w-4 h-4 text-[#168A5B]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#063B2A] dark:text-white">
                    ₹{(totalAmount / 100000).toFixed(2)} <span className="text-sm font-sans font-medium text-slate-500">Lakh</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                    {language === 'hi' ? 'डीबीटी भुगतान हेतु अधिकृत' : 'Authorized for DBT clearance'}
                  </p>
                </div>

                {/* Average Moisture */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-xs font-semibold">{language === 'hi' ? 'औसत नमी प्रतिशत' : 'Average Moisture %'}</span>
                    <AlertTriangle className={`w-4 h-4 ${avgMoisture > 14 ? 'text-amber-500' : 'text-emerald-600'}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#063B2A] dark:text-white">
                    {avgMoisture.toFixed(1)}%
                  </div>
                  <p className={`text-[11px] mt-1 ${avgMoisture <= 12 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {avgMoisture <= 12 
                      ? (language === 'hi' ? 'उत्कृष्ट (FAQ मानक सीमा में)' : 'Optimal (Within FAQ standards)')
                      : (language === 'hi' ? 'ध्यान दें: सुखाने हेतु डॉकेज लागू' : 'Caution: Dockage applicable')}
                  </p>
                </div>

              </div>

              {/* Commodity Quick Cards */}
              {Object.keys(commodityBreakdown).length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {language === 'hi' ? 'फसल अनुसार उपार्जन विभाजन' : 'Commodity-Wise Procurement Breakdown'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {Object.entries(commodityBreakdown).map(([comm, stats]) => {
                      const pct = totalQty > 0 ? ((stats.qty / totalQty) * 100).toFixed(1) : '0';
                      return (
                        <div key={comm} className="p-3 rounded-xl bg-[#F0F5F2] dark:bg-[#143026] border border-[#D7E3DC] dark:border-[#2B5E4A]">
                          <span className="text-xs font-bold text-slate-800 dark:text-white block truncate">{comm}</span>
                          <span className="text-lg font-bold font-mono text-[#0B5D3B] dark:text-emerald-400 block">{stats.qty.toFixed(1)} Qtl</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{stats.count} lots • {pct}% share</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Dynamic Visual Distribution Charts */}
          {activeTab === 'charts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Commodity Volume Bars */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#168A5B]" />
                  <span>{language === 'hi' ? 'जिंस अनुसार आवक मात्रा (क्विंटल)' : 'Commodity Inward Volume (Quintals)'}</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(commodityBreakdown).map(([comm, stats]) => {
                    const pct = totalQty > 0 ? (stats.qty / totalQty) * 100 : 0;
                    return (
                      <div key={comm} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{comm}</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{stats.qty.toFixed(1)} Qtl ({pct.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-[#168A5B] to-emerald-400 transition-all duration-500"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Counter Load Breakdown */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#168A5B]" />
                  <span>{language === 'hi' ? 'धर्मकांटा / काउन्टर लोड आवंटन' : 'Weighbridge Counter Load Allocation'}</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(counterBreakdown).map(([counter, count]) => {
                    const pct = totalRecords > 0 ? (count / totalRecords) * 100 : 0;
                    return (
                      <div key={counter} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{counter}</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{count} vehicles ({pct.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Interactive Raw Data Table */}
          {activeTab === 'table' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E241C] border border-[#C7DCD1] dark:border-[#2B5E4A] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'hi' ? 'खोजें (नाम, टोकन, जिंस...)' : 'Search (Name, Token, Crop...)'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-[#2B5E4A] bg-slate-50 dark:bg-[#143026] text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#168A5B]"
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'प्रदर्शित रिकॉर्ड:' : 'Displaying:'} <span className="font-bold text-slate-800 dark:text-white">{filteredData.length}</span> / {totalRecords}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2B5E4A]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F0F5F2] dark:bg-[#143026] text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-[#2B5E4A]">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="p-3 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#2B5E4A]/50">
                    {filteredData.slice(0, 50).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#143026]/50">
                        {columns.map((col) => (
                          <td key={col} className="p-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {String(row[col] ?? '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
