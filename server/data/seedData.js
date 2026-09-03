/**
 * Realistic seed data for SecureChain DMS
 * Modeled after official Indian First Information Report (FIR Form No. 24.5(1) CrPC 154)
 * Generic role titles used everywhere — NO invented personal names.
 * NO reference to "Cyber Crime" — general investigation scope.
 */

const DEMO_PERSONAS = [
  // 1. POLICE / INVESTIGATING OFFICERS
  {
    id: "POL-DL-4892",
    portalRole: "POLICE",
    name: "Police Official (Investigating Officer)",
    role: "Investigating Officer (Requester)",
    department: "Special Investigation Division, Mandir Marg, New Delhi",
    badge: "IO-4892",
    rank: "Sub-Inspector",
    pseudonym: "Officer_DL94",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: true,
    canApprove: false,
    canDeAnonymize: false,
    policeStation: "Special Investigation Division PS, Mandir Marg, New Delhi",
    otp: "123456"
  },
  {
    id: "POL-IPS-1094",
    portalRole: "POLICE",
    name: "Police Official (Supervisory Reviewer)",
    role: "Supervisory Reviewer (Approver 1)",
    department: "State Crime Investigation Branch, Headquarters",
    badge: "POL-1094",
    rank: "Superintendent of Police",
    pseudonym: "Approver_1",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: false,
    canApprove: true,
    canDeAnonymize: false,
    policeStation: "State Criminal Investigation Department, Mumbai",
    otp: "123456"
  },
  {
    id: "POL-SPS-2201",
    portalRole: "POLICE",
    name: "Police Official (Review Board Member)",
    role: "Review Board Member (Approver 2)",
    department: "Investigation & Inspection Wing, CID",
    badge: "POL-2201",
    rank: "Deputy Superintendent of Police",
    pseudonym: "Approver_2",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: false,
    canApprove: true,
    canDeAnonymize: false,
    policeStation: "Central Police Station, CID, Bengaluru",
    otp: "123456"
  },

  // 2. JUDICIAL AUTHORITIES
  {
    id: "JUD-ND-1044",
    portalRole: "JUDICIAL",
    name: "Judicial Officer (Hon. Justice Iyer / Presiding Magistrate)",
    role: "Presiding Magistrate / Judicial Authority",
    department: "Patiala House Courts, New Delhi (Special Investigation Court)",
    badge: "JUD-1044",
    rank: "Presiding Magistrate",
    pseudonym: "Judicial_Authority",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: false,
    canApprove: true,
    canDeAnonymize: true,
    court: "Patiala House Courts, New Delhi",
    otp: "123456"
  },
  {
    id: "JUD-DEL-089",
    portalRole: "JUDICIAL",
    name: "Judicial Officer (Magistrate / Audit Authority)",
    role: "Metropolitan Magistrate",
    department: "Patiala House Courts, New Delhi (Special Investigation Court)",
    badge: "JUD-089",
    rank: "Presiding Magistrate",
    pseudonym: "Judicial_Authority",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: false,
    canApprove: true,
    canDeAnonymize: true, // Audit authority can de-anonymize with mandatory typed justification
    court: "Patiala House Courts, New Delhi",
    otp: "123456"
  },
  {
    id: "PROS-HC-441",
    portalRole: "JUDICIAL",
    name: "Judicial Officer (Public Prosecutor)",
    role: "Public Prosecutor (Approver 3)",
    department: "High Court of Delhi, Prosecution Directorate",
    badge: "PROS-441",
    rank: "Prosecuting Officer",
    pseudonym: "Approver_3",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: false,
    canApprove: true,
    canDeAnonymize: false,
    court: "High Court of Delhi",
    otp: "123456"
  },

  // 3. FORENSIC SCIENTISTS & EXPERTS
  {
    id: "FSL-EXP-209",
    portalRole: "FORENSIC",
    name: "Forensic Officer (Dr. Sunita Rao / Scientific Examiner)",
    role: "Chief Scientific Examiner & Digital Forensics Head",
    department: "Central Forensic Science Laboratory (CFSL), New Delhi",
    badge: "FSL-209",
    rank: "Senior Scientific Officer",
    pseudonym: "Forensic_Examiner",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: true,
    canApprove: true,
    canDeAnonymize: false,
    labUnit: "CFSL New Delhi",
    otp: "123456"
  },
  {
    id: "FSL-CBI-702",
    portalRole: "FORENSIC",
    name: "Forensic Officer (Scientific Examiner)",
    role: "Chief Scientific Examiner",
    department: "Central Forensic Science Laboratory (CFSL), New Delhi",
    badge: "FSL-702",
    rank: "Senior Scientific Officer",
    pseudonym: "Forensic_Examiner",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: true,
    canApprove: true,
    canDeAnonymize: false,
    labUnit: "CFSL New Delhi",
    otp: "123456"
  },
  {
    id: "AUD-MHA-007",
    portalRole: "AUDITOR",
    name: "Statutory Auditor (WORM & Evidence Sentinel)",
    role: "Chief Statutory Auditor & WORM Custodian",
    department: "National Audit Directorate / Ministry of Home Affairs",
    badge: "AUD-007",
    rank: "Chief Custodian & Lead Auditor",
    pseudonym: "Custodian_M07",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    canRequestEdit: false,
    canApprove: true,
    canDeAnonymize: true,
    labUnit: "National Evidence Repository Vault, MHA",
    otp: "123456"
  }
];

// Seed Registered Citizens for the Public / Citizen Portal
const SEED_CITIZENS = [
  {
    id: "CIT-001",
    name: "Citizen Complainant",
    mobile: "9876543210",
    ackNumber: "ACK-2024-88412",
    email: "citizen.delhi@gov.in",
    otp: "123456",
    linkedCases: ["FIR-2024-ND-0842"]
  },
  {
    id: "CIT-002",
    name: "Citizen Informant",
    mobile: "9812345678",
    ackNumber: "ACK-2024-19205",
    email: "citizen.mumbai@gov.in",
    otp: "123456",
    linkedCases: ["FIR-2024-MH-1920"]
  }
];

// Realistic Indian Legal FIR Cases under CrPC Section 154 / BNSS 173
const SEED_CASES = [
  {
    id: "FIR-2024-ND-0842",
    firNo: "0842/2024",
    year: "2024",
    state: "Delhi",
    district: "New Delhi District",
    policeStation: "Special Investigation Division PS, Mandir Marg",
    actsAndSections: "Section 420/468/471/120B IPC r/w Section 66D IT Act 2000",
    caseTitle: "Inter-State Banking Embezzlement & Forged Document Syndicate",
    crimeCategory: "Financial Embezzlement & Banking Fraud",
    dateReported: "2024-08-14T10:30:00.000Z",
    occurrenceDate: "12/08/2024 to 14/08/2024 (Continuous)",
    placeOfOccurrence: "State Bank Corporate Branch, 4.2 KM West from PS",
    typeOfInformation: "Written Complaint",
    complainant: "Chief Vigilance Officer, State Bank of India Corporate Centre",
    accused: "Primary Account Holder Rohit Varma & 5 Unknown Syndicate Associates",
    investigatingOfficer: "Police Official (Investigating Officer)",
    requesterId: "POL-DL-4892",
    currentVersion: "1.0",
    status: "LOCKED",
    statusPlain: "Under Investigation",
    propertiesInvolved: "Seized MicroSD cards, 18 forged identification documents, debit instruments",
    stolenValue: "INR 4,82,50,000/- (Four Crores Eighty Two Lakhs Fifty Thousand)",
    actionTaken: "Case registered under Section 154 CrPC, investigation entrusted to Sub-Inspector DL-4892",
    inquestNo: "N/A",
    delayReasons: "Immediate audit required by bank vigilance before formal submission",
    incidentSummary: `Complainant bank reported coordinated financial embezzlement through fraudulent payment gateways and forged identity documents.
Funds totaling INR 4,82,50,000/- were diverted across 42 beneficiary accounts in multiple jurisdictions.
Primary suspect detained at IGI Airport with 18 SIM cards and 24 forged identification cards.
Forensic mirror images and server logs extracted and sealed under Section 65B of the Indian Evidence Act / Section 63 BSA 2023.`,
    evidenceFiles: [
      { name: "Bank_Transaction_Ledger_42Accounts.csv", size: "4.8 MB", sha256: "3d5f8a0e889c2b4c10294e77da1b1c3e7f4a56b2c890de41fa7712398ab45c11" },
      { name: "Forensic_Seizure_Memo_Exhibits_01_to_18.pdf", size: "18.2 MB", sha256: "91c28ef5a34b223d77881023cdb199047b8c23f101ab45ef66d2145890bc4123" }
    ],
    versions: [
      {
        version: "1.0",
        createdAt: "2024-08-14T11:00:00.000Z",
        status: "LOCKED",
        title: "Initial Formal FIR Registration",
        authorId: "POL-DL-4892",
        authorPseudonym: "Officer_DL94",
        summaryDiff: "Genesis formal registration of FIR under Section 154 CrPC."
      }
    ]
  },
  {
    id: "FIR-2024-MH-1920",
    firNo: "1920/2024",
    year: "2024",
    state: "Maharashtra",
    district: "Mumbai City",
    policeStation: "State Criminal Investigation Department, Mumbai",
    actsAndSections: "Section 66F IT Act 2000 r/w Section 384/506/121A IPC",
    caseTitle: "Critical Infrastructure SCADA Intrusion & Extortion Attempt",
    crimeCategory: "Critical Infrastructure SCADA Intrusion",
    dateReported: "2024-08-20T03:15:00.000Z",
    occurrenceDate: "20/08/2024 at 02:40 IST",
    placeOfOccurrence: "Load Despatch Centre Controller Substation, Cuffe Parade",
    typeOfInformation: "Written Official Report",
    complainant: "Chief Systems Officer, State Load Despatch Centre",
    accused: "Extortion Syndicate Operating under 'BlackByte-Telemetry'",
    investigatingOfficer: "Police Official (Investigating Officer)",
    requesterId: "POL-DL-4892",
    currentVersion: "1.0",
    draftVersion: "1.1",
    status: "PENDING_QUORUM",
    statusPlain: "Update Pending Review",
    propertiesInvolved: "Industrial control hardware, telemetry packet logs, memory capture chips",
    stolenValue: "Ransom demand of 15 BTC (approx. INR 8.1 Crores)",
    actionTaken: "FIR registered under National Security & Extortion provisions; supplementary technical evidence appended",
    inquestNo: "N/A",
    delayReasons: "None — emergency immediate registration",
    incidentSummary: `At 02:40 IST, perimeter monitoring detected unauthorized intrusion attempt into the Substation Automation Controller Network.
A bespoke payload designed to disrupt telemetry communication was isolated in volatile memory. Ransom communication demanded cryptocurrency transfer under threat of regional grid disruption.
Emergency technical response team isolated lateral channels. Packet captures and RAM memory dumps sealed under strict evidentiary chain of custody.`,
    evidenceFiles: [
      { name: "SCADA_Telemetry_Capture_Raw_104.pcapng", size: "840 MB", sha256: "a094bb7621cde456881900112aa56e789bc10123ef4512399810a9117bce3210" },
      { name: "Volatile_RAM_Dump_Substation_Server.raw", size: "16 GB", sha256: "55e41aa902bc45119908de1234bc56ef7810aa345b1289de66c10123fa774431" }
    ],
    versions: [
      {
        version: "1.0",
        createdAt: "2024-08-20T04:30:00.000Z",
        status: "LOCKED",
        title: "Initial Emergency Incident Registration",
        authorId: "POL-DL-4892",
        authorPseudonym: "Officer_DL94",
        summaryDiff: "Initial filing of Section 154 CrPC FIR with system captures."
      },
      {
        version: "1.1",
        createdAt: "2024-08-21T09:15:00.000Z",
        status: "PENDING_QUORUM",
        title: "Supplementary Forensic Examination Report",
        authorId: "POL-DL-4892",
        authorPseudonym: "Officer_DL94",
        summaryDiff: "Added Section 121A (Waging War against the State), appended foreign C2 endpoint logs and decrypt key hashes."
      }
    ]
  },
  {
    id: "FIR-2024-KA-0518",
    firNo: "0518/2024",
    year: "2024",
    state: "Karnataka",
    district: "Bengaluru City",
    policeStation: "Central Police Station, CID Headquarters, Palace Road",
    actsAndSections: "Section 66D, 66E IT Act 2000 r/w Section 354D, 384, 506 IPC",
    caseTitle: "Extortion & Synthetic Identity Voice Cloning Syndicate",
    crimeCategory: "Extortion & Synthetic Identity Fraud",
    dateReported: "2024-08-22T14:45:00.000Z",
    occurrenceDate: "22/08/2024 at 13:10 IST",
    placeOfOccurrence: "Complainant Residence, Sadashivanagar, Bengaluru",
    typeOfInformation: "Oral statement reduced to writing",
    complainant: "Vice Chancellor, State Technological University",
    accused: "Anonymous Syndicate utilizing synthetic voice generation APIs",
    investigatingOfficer: "Police Official (Investigating Officer)",
    requesterId: "POL-DL-4892",
    currentVersion: "1.0",
    status: "LOCKED",
    statusPlain: "Under Investigation",
    propertiesInvolved: "Acoustic audio recordings, call session metadata, payment receipt slips",
    stolenValue: "INR 25,00,000/- (Twenty Five Lakhs)",
    actionTaken: "Case registered, call session trunk lines traced via Department of Telecommunications",
    inquestNo: "N/A",
    delayReasons: "Complainant was under acute duress before reporting",
    incidentSummary: `Complainant received threatening telephonic calls simulating his daughter in acute distress, demanding immediate ransom transfer.
Acoustic frequency analysis confirmed synthetic voice artifacts characteristic of neural audio synthesis.
Trunk line signaling logs seized and sealed under Evidence Act Section 65B.`,
    evidenceFiles: [
      { name: "FSL_Acoustic_Frequency_Analysis_Report.pdf", size: "12.4 MB", sha256: "77aa9011de54bc3210aa98bc45ef123490bcae115623cd89aa102345bc678912" }
    ],
    versions: [
      {
        version: "1.0",
        createdAt: "2024-08-22T16:00:00.000Z",
        status: "LOCKED",
        title: "Initial FIR Registration & Acoustic Evidence Ingestion",
        authorId: "POL-DL-4892",
        authorPseudonym: "Officer_DL94",
        summaryDiff: "Formal FIR registered under Extortion and Intimidation provisions."
      }
    ]
  }
];

module.exports = {
  DEMO_PERSONAS,
  SEED_CITIZENS,
  SEED_CASES
};
