import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [candidateForm, setCandidateForm] = useState({ name: "", party: "", symbol: "" });
  const [counts, setCounts] = useState([]);
  const [votes, setVotes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const [countsRes, votesRes] = await Promise.all([api.get("/vote/counts"), api.get("/vote/all")]);
      setCounts(countsRes.data.results || []);
      setVotes(votesRes.data.votes || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onCreateCandidate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/vote/candidates", candidateForm);
      setMessage(data.message || "Candidate created");
      setCandidateForm({ name: "", party: "", symbol: "" });
      loadDashboard();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Candidate creation failed");
    }
  };

  const totalVotes = counts.reduce((sum, row) => sum + row.totalVotes, 0);
  const totalCandidates = counts.length;
  const totalAuditRecords = votes.length;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-300/70 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-4 py-5 text-slate-100 sm:px-6 sm:py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Administrative Console</p>
          <h1 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">National Election Control Room</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Monitor vote activity, manage candidate records, and review ballot audit logs in a secure environment.
          </p>
        </div>
        <div className="grid gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm md:grid-cols-3 md:px-6">
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
            <span className="font-semibold text-slate-900">Total Votes:</span> {totalVotes}
          </p>
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
            <span className="font-semibold text-slate-900">Candidates in Results:</span> {totalCandidates}
          </p>
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
            <span className="font-semibold text-slate-900">Audit Records:</span> {totalAuditRecords}
          </p>
        </div>
      </div>

      {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">{message}</p>}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-slate-900">Register Candidate</h2>
          <p className="mt-1 text-sm text-slate-600">Add a candidate record for the active election cycle.</p>
          <form onSubmit={onCreateCandidate} className="mt-4 space-y-3">
            <input
              className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Candidate Name"
              value={candidateForm.name}
              onChange={(event) => setCandidateForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <input
              className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Political Party"
              value={candidateForm.party}
              onChange={(event) => setCandidateForm((prev) => ({ ...prev, party: event.target.value }))}
            />
            <input
              className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Ballot Symbol"
              value={candidateForm.symbol}
              onChange={(event) => setCandidateForm((prev) => ({ ...prev, symbol: event.target.value }))}
            />
            <button className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800">
              Create Candidate
            </button>
          </form>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-slate-900">Live Vote Tally</h2>
          <p className="mt-1 text-sm text-slate-600">Aggregated vote counts by candidate.</p>
          <div className="mt-4 space-y-3">
            {counts.length === 0 && <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No votes recorded yet.</p>}
            {counts.map((row) => (
              <div key={row.candidateId} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="font-medium text-slate-800 break-words">
                  {row.name} ({row.party})
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-bold text-white">{row.totalVotes}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-slate-900 sm:text-xl">Ballot Audit Trail</h2>
          <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            Read Only
          </span>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-100">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Citizen</th>
                <th className="px-3 py-2.5 font-semibold">Voter ID</th>
                <th className="px-3 py-2.5 font-semibold">Candidate</th>
                <th className="px-3 py-2.5 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote, index) => (
                <tr key={vote._id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-3 py-2.5 text-slate-800">{vote.userId?.name}</td>
                  <td className="px-3 py-2.5 text-slate-700">{vote.userId?.voterId}</td>
                  <td className="px-3 py-2.5 text-slate-800">{vote.candidateId?.name}</td>
                  <td className="px-3 py-2.5 text-slate-700">{new Date(vote.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {votes.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-3 py-6 text-center text-slate-600">
                    No audit records available at this time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default AdminDashboard;
