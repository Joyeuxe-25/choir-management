'use client';

import SectionCard from '@/components/shared/SectionCard';
import { useDashboard } from '@/hooks/useDashboard';
import styles from './VoiceSummary.module.css';

const VOICES = ['Soprano', 'Alto', 'Tenor', 'Bass'] as const;

export default function VoiceSummary() {
  const { data, loading, error } = useDashboard();

  const s = data?.summary;

  const val = (n?: number) => {
    if (loading) return '…';
    if (error || n === undefined) return '—';
    return n;
  };

  const counts = {
    Soprano: val(s?.soprano),
    Alto:    val(s?.alto),
    Tenor:   val(s?.tenor),
    Bass:    val(s?.bass),
  };

  return (
    <SectionCard title="Members by Voice">
      {error && (
        <p style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          Could not load voice data.
        </p>
      )}
      <div className={styles.voiceList}>
        {VOICES.map((voice) => (
          <div key={voice} className={styles.voiceItem}>
            <span className={styles.voiceName}>{voice}</span>
            <span className={styles.voiceCount}>{counts[voice]}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}