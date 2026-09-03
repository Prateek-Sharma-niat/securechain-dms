/**
 * Quorum Consensus Engine
 * Implements M-of-N multi-party governance for document edit approvals.
 * Enforces Rule 4B: Requester can never self-approve.
 */

class QuorumEngine {
  constructor() {
    this.requests = new Map(); // key: `${docId}_${version}` -> QuorumSession
  }

  /**
   * Initializes a quorum approval session for a pending document draft/edit
   */
  createSession({
    docId,
    version,
    requesterId,
    requesterName,
    requesterRole,
    editSummary,
    threshold = 2,
    totalEligible = 3,
    eligibleApprovers = []
  }) {
    const sessionKey = `${docId}_${version}`;

    const session = {
      sessionKey,
      docId,
      version,
      requesterId,
      requesterName,
      requesterRole,
      editSummary,
      threshold,
      totalEligible,
      status: "PENDING_QUORUM", // PENDING_QUORUM | APPROVED | REJECTED
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Pre-assigned anonymous approver slots
      approverSlots: eligibleApprovers.map((approver, index) => ({
        slotIndex: index + 1,
        approverId: approver.id,
        pseudonym: approver.pseudonym || `Approver_Node_${index + 1}`,
        title: approver.title || `Supervisory Reviewer ${index + 1}`,
        avatar: approver.avatar || `Officer #${index + 1}`,
        hasVoted: false,
        vote: null, // "APPROVE" | "REJECT"
        votedAt: null,
        comment: null
      })),
      votes: [], // audit trail of cast votes
      approvalCount: 0,
      rejectionCount: 0
    };

    this.requests.set(sessionKey, session);
    return session;
  }

  getSession(docId, version) {
    const sessionKey = `${docId}_${version}`;
    return this.requests.get(sessionKey) || null;
  }

  /**
   * Casts a vote on a quorum session.
   * Hard-blocks self-approval: requester cannot vote.
   */
  castVote({ docId, version, approverId, approverName, vote, comment = "" }) {
    const sessionKey = `${docId}_${version}`;
    const session = this.requests.get(sessionKey);

    if (!session) {
      throw new Error(`No active quorum session found for ${docId} version ${version}`);
    }

    if (session.status !== "PENDING_QUORUM") {
      throw new Error(`Quorum session is already finalized with status: ${session.status}`);
    }

    // RULE 4B HARD BLOCK: Requester can NEVER approve their own edit
    if (session.requesterId === approverId) {
      const err = new Error("RULE 4B VIOLATION: Requester is strictly barred from approving their own update request.");
      err.code = "SELF_APPROVAL_FORBIDDEN";
      err.status = 403;
      throw err;
    }

    // Find slot for this approver or find an open eligible slot
    let slot = session.approverSlots.find(s => s.approverId === approverId);
    if (!slot) {
      // Find first unvoted slot
      slot = session.approverSlots.find(s => !s.hasVoted);
      if (slot) {
        slot.approverId = approverId;
      }
    }

    if (slot && slot.hasVoted) {
      throw new Error("This approver has already cast a vote for this quorum session.");
    }

    // Record the vote
    const now = new Date().toISOString();
    if (slot) {
      slot.hasVoted = true;
      slot.vote = vote;
      slot.votedAt = now;
      slot.comment = comment;
    }

    session.votes.push({
      approverId,
      pseudonym: slot ? slot.pseudonym : `Reviewer_${approverId.substring(0, 4)}`,
      vote,
      comment,
      timestamp: now
    });

    if (vote === "APPROVE") {
      session.approvalCount++;
    } else if (vote === "REJECT") {
      session.rejectionCount++;
    }

    session.updatedAt = now;

    // Check if threshold is reached
    let outcomeChanged = false;
    if (session.approvalCount >= session.threshold) {
      session.status = "APPROVED";
      outcomeChanged = true;
    } else if (session.rejectionCount > (session.totalEligible - session.threshold)) {
      session.status = "REJECTED";
      outcomeChanged = true;
    }

    return {
      session,
      outcomeChanged,
      isApproved: session.status === "APPROVED",
      isRejected: session.status === "REJECTED"
    };
  }
}

module.exports = new QuorumEngine();
