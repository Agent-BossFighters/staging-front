import { useState, useCallback } from 'react';
import { useBatchDepositTriple, VoteDirection } from 'player-map';

/**
 * Custom hook to manage voting functionality
 * @param {Object} params - Parameters for the hook
 * @param {boolean} params.walletConnected - Whether the wallet is connected
 * @param {string} params.walletAddress - The wallet address
 * @param {Object} params.publicClient - The public client
 * @returns {Object} - Voting methods and state
 */
const useVoting = ({ walletConnected, walletAddress, publicClient }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voteResult, setVoteResult] = useState(null);

  // Use the batchDepositTriple hook from player-map
  const { batchDepositTriple } = useBatchDepositTriple({
    walletConnected,
    walletAddress,
    publicClient
  });

  /**
   * Submit votes for multiple claims
   * @param {Array} voteData - Array of vote data objects
   * @param {bigint} voteData[].claimId - The claim ID
   * @param {number} voteData[].units - Number of voting units
   * @param {VoteDirection} voteData[].direction - Direction of the vote (For/Against)
   */
  const submitVotes = useCallback(async (voteData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await batchDepositTriple(voteData);

      if (result.success) {
        setVoteResult({
          success: true,
          hash: result.hash
        });
        return result;
      } else {
        setError(result.error || 'Une erreur est survenue lors du vote');
        setVoteResult({
          success: false,
          error: result.error
        });
        return result;
      }
    } catch (err) {
      console.error("Erreur lors de la soumission des votes:", err);
      setError(err.message || 'Une erreur inattendue est survenue');
      setVoteResult({
        success: false,
        error: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [batchDepositTriple]);

  return {
    submitVotes,
    loading,
    error,
    voteResult,
    VoteDirection, // Expose the VoteDirection enum for convenience
  };
};

export default useVoting; 