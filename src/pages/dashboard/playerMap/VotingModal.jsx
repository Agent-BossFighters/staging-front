import { useEffect } from 'react';
import { ClaimVoting } from 'player-map';
import PropTypes from 'prop-types';

/**
 * Modal component for the voting system using Player-Map's ClaimVoting
 */
const VotingModal = ({ 
  walletConnected, 
  walletAddress, 
  publicClient, 
  onClose 
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div style={{ transform: 'translateY(10vh)' }} className="rounded-lg shadow-xl max-w-4xl w-full min-h-[75vh] max-h-[75vh] overflow-hidden flex flex-col">

        
        <div className="flex-1 overflow-auto">
          <ClaimVoting
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            publicClient={publicClient}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

VotingModal.propTypes = {
  walletConnected: PropTypes.object.isRequired,
  walletAddress: PropTypes.string,
  publicClient: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default VotingModal; 