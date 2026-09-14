/**
 * SystemStateBadge - Canonical Technical Status Badge
 * 
 * Compliant with SIH Technical Evaluation Matrix.
 * Guarantees deep-linking into SIH Audit Inspector with the exact feature selected.
 */

import React from 'react';
import { IntegrationBadge } from './IntegrationBadge';
import { FeatureRegistryService } from '../../domain/featureRegistry';
import { IntegrationStatusBadge } from '../../types';

interface SystemStateBadgeProps {
  featureId: string;
  variant?: 'badge' | 'indicator';
  className?: string;
  overrideLabel?: string;
}

export const SystemStateBadge: React.FC<SystemStateBadgeProps> = ({
  featureId,
  variant = 'indicator',
  className = '',
  overrideLabel
}) => {
  const feature = FeatureRegistryService.getById(featureId);

  if (!feature) {
    return (
      <IntegrationBadge
        status="PROPOSED"
        featureId={featureId}
        featureName={overrideLabel || featureId}
        variant={variant}
        className={className}
      />
    );
  }

  const badgeStatus: IntegrationStatusBadge = 
    feature.state === 'INTEGRATION_READY' ? 'INTEGRATION-READY' : feature.state;

  return (
    <IntegrationBadge
      status={badgeStatus}
      featureId={feature.featureId}
      featureName={overrideLabel || feature.name}
      spec={feature.badgeTag}
      variant={variant}
      className={className}
    />
  );
};
