import { useEffect, useState } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Vote = () => {
  const { user } = useAuth();
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [faceEncoding, setFaceEncoding] = useState("");
  const [hasVoted, setHasVoted] = useState(Boolean(user?.hasVoted));

  const loadContestingParties = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/vote/parties");
      setParties(data.parties || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load political parties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContestingParties();
  }, []);

  useEffect(() => {
    setHasVoted(Boolean(user?.hasVoted));
  }, [user]);

  const castVote = async () => {
    setMessage("");
    setError("");

    if (hasVoted) {
      setError("Your vote is already recorded.");
      return;
    }

    if (!selectedParty?.candidateId) {
      setError("Please select a political party before casting your vote.");
      return;
    }

    if (!faceEncoding) {
      setError("Please capture your face to continue.");
      return;
    }

    try {
      const { data } = await api.post("/vote/cast", {
        candidateId: selectedParty.candidateId,
        faceEncoding
      });
      setMessage(data.message || `Your vote for ${selectedParty.party} has been recorded successfully.`);
      setHasVoted(true);
    } catch (apiError) {
      const apiMessage = apiError.response?.data?.message || "Failed to cast vote";
      if (apiMessage === "Repeated Vote Detected") {
        setError("Repeated Vote Detected");
        setHasVoted(true);
      } else {
        setError(apiMessage);
      }
    }
  };

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-300/70 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-4 py-5 text-slate-100 sm:px-6 sm:py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Official Ballot</p>
          <h1 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">National Citizen Voting Desk</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Select one registered party and complete biometric verification to submit your ballot. Each citizen account can vote only once.
          </p>
        </div>
        <div className="grid gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 md:grid-cols-3 md:gap-4 md:px-6">
          <p>
            <span className="font-semibold text-slate-900">Session Status:</span> Citizen Authenticated
          </p>
          <p>
            <span className="font-semibold text-slate-900">Ballot Type:</span> Single Choice
          </p>
          <p>
            <span className="font-semibold text-slate-900">Verification:</span> Live Face Capture
          </p>
        </div>
      </div>

      {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">{message}</p>}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}
      {hasVoted && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900">
          A ballot has already been submitted from this account. Additional votes are not permitted.
        </p>
      )}

      {loading ? (
        <p className="rounded-xl border border-slate-300 bg-white p-4 text-slate-700">Loading contesting political parties...</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {parties.map((party) => {
            const isSelected = selectedParty?.candidateId === party.candidateId;

            return (
              <article
                key={party.candidateId}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                  isSelected ? "border-slate-900 shadow-md" : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-heading text-lg font-semibold text-slate-900 sm:text-xl">{party.party}</h2>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">Approved</span>
                </div>

                <div className="mt-4 space-y-1 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Candidate:</span> {party.candidateName}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Ballot Symbol:</span> {party.symbol}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={hasVoted}
                  onClick={() => {
                    setSelectedParty(party);
                    setMessage("");
                    setError("");
                    setFaceEncoding("");
                  }}
                  className={`mt-5 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${
                    isSelected ? "bg-slate-900" : "bg-slate-700 hover:bg-slate-800"
                  } disabled:cursor-not-allowed disabled:bg-slate-300`}
                >
                  {isSelected ? "Party Selected" : "Select This Party"}
                </button>
              </article>
            );
          })}

          {parties.length === 0 && (
            <p className="md:col-span-2 lg:col-span-3 rounded-xl border border-slate-300 bg-white p-4 text-slate-700">
              No political parties are currently registered for this election cycle.
            </p>
          )}
        </div>
      )}

      {selectedParty && !hasVoted && (
        <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-md sm:p-5">
          <h3 className="font-heading text-lg font-semibold text-slate-900 sm:text-xl">Biometric Verification</h3>
          <p className="mt-1 text-sm text-slate-700">
            Selected Party: <span className="font-semibold text-slate-900">{selectedParty.party}</span>
          </p>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <WebcamCapture onCapture={setFaceEncoding} label="Capture Face Identity" />
          </div>

          {faceEncoding && <p className="mt-3 text-xs font-medium text-emerald-700">Face verification snapshot captured. You may now submit your ballot.</p>}

          <button
            type="button"
            onClick={castVote}
            disabled={!faceEncoding}
            className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Confirm Vote for {selectedParty.party}
          </button>
        </div>
      )}
    </section>
  );
};

export default Vote;
