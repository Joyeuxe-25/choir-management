import SectionCard from '@/components/shared/SectionCard';
import { membersByVoice } from '@/data/dashboard';
import styles from './VoiceSummary.module.css';

export default function VoiceSummary() {
  return (
    <SectionCard title="Members by Voice">
      <div className={styles.voiceList}>
        {Object.entries(membersByVoice).map(([voice, count]) => (
          <div key={voice} className={styles.voiceItem}>
            <span className={styles.voiceName}>{voice}</span>
            <span className={styles.voiceCount}>{count}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}