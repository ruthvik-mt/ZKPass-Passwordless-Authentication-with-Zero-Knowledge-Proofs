import { useState } from 'react';
import '../styles/Auth.css';

interface RecoveryPhraseDisplayProps {
  recoveryPhrase: string;
  onContinue: () => void;
}

const RecoveryPhraseDisplay = ({ recoveryPhrase, onContinue }: RecoveryPhraseDisplayProps) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryPhrase);
    alert('Recovery phrase copied to clipboard');
  };

  return (
    <div className="auth-container">
      <h2>Save Your Recovery Phrase</h2>
      
      <div className="recovery-phrase-box">
        <p>{recoveryPhrase}</p>
      </div>
      
      <div className="recovery-instructions">
        <p>
          <strong>IMPORTANT:</strong> Save this recovery phrase in a secure location. 
          You will need it to recover your UID if you forget it.
        </p>
        <p>
          We recommend writing it down on paper and storing it in a safe place. 
          Do not share this phrase with anyone.
        </p>
      </div>
      
      <button onClick={handleCopy} className="copy-button">
        Copy to Clipboard
      </button>
      
      <div className="confirmation-checkbox">
        <input
          type="checkbox"
          id="confirm"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <label htmlFor="confirm">
          I have saved my recovery phrase in a secure location
        </label>
      </div>
      
      <button 
        onClick={onContinue} 
        className="auth-button"
        disabled={!confirmed}
      >
        Continue
      </button>
    </div>
  );
};

export default RecoveryPhraseDisplay;