import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const workflowStatuses = [
  "received",
  "triaged",
  "scheduled",
  "completed",
] as const;

type WorkflowStatus = (typeof workflowStatuses)[number];

type CareRequest = {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  concern: string;
  urgency: "routine" | "soon" | "urgent";
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
};

type IntakeForm = {
  patientName: string;
  email: string;
  phone: string;
  concern: string;
  urgency: "routine" | "soon" | "urgent";
};

const initialForm: IntakeForm = {
  patientName: "",
  email: "",
  phone: "",
  concern: "",
  urgency: "routine",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function App() {
  const [form, setForm] = useState<IntakeForm>(initialForm);
  const [workflows, setWorkflows] = useState<CareRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadWorkflows() {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows`);

      if (!response.ok) {
        throw new Error("Unable to load care requests.");
      }

      const payload: { data: CareRequest[] } = await response.json();
      setWorkflows(payload.data);
      setError("");
    } catch {
      setError(
        "Unable to reach the CareLine API. Confirm that the API is running on port 4000.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkflows();
  }, []);

  function updateForm(
    field: keyof IntakeForm,
    value: IntakeForm[keyof IntakeForm],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows/intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload: {
        message?: string;
        error?: string;
        data?: CareRequest;
      } = await response.json();

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Unable to submit care request.");
      }

      setWorkflows((currentWorkflows) => [
        payload.data as CareRequest,
        ...currentWorkflows,
      ]);
      setForm(initialForm);
      setSuccessMessage("Care request submitted successfully.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit care request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateStatus(id: string, status: WorkflowStatus) {
    setUpdatingId(id);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/workflows/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const payload: {
        message?: string;
        error?: string;
        data?: CareRequest;
      } = await response.json();

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Unable to update workflow status.");
      }

      setWorkflows((currentWorkflows) =>
        currentWorkflows.map((workflow) =>
          workflow.id === id ? (payload.data as CareRequest) : workflow,
        ),
      );
      setSuccessMessage("Workflow status updated.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update workflow status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            +
          </span>
          CareLine
        </a>
        <span className="environment-badge">Workflow simulator</span>
      </header>

      <section className="hero-section">
        <p className="eyebrow">Patient coordination</p>
        <h1>Care requests, clearly coordinated.</h1>
        <p className="hero-copy">
          Capture patient needs and move each request through a simple care
          workflow.
        </p>
      </section>

      <section className="dashboard-grid" aria-label="CareLine dashboard">
        <article className="panel intake-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">New request</p>
              <h2>Start a care intake</h2>
            </div>
            <span className="step-label">Step 1 of 1</span>
          </div>

          <form className="intake-form" onSubmit={handleSubmit}>
            <label>
              Patient name
              <input
                type="text"
                value={form.patientName}
                onChange={(event) =>
                  updateForm("patientName", event.target.value)
                }
                placeholder="e.g., Jordan Lee"
                minLength={2}
                maxLength={100}
                required
              />
            </label>

            <div className="form-row">
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  placeholder="jordan@example.com"
                  required
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  placeholder="555-014-7788"
                  minLength={7}
                  maxLength={25}
                  required
                />
              </label>
            </div>

            <label>
              Care concern
              <textarea
                value={form.concern}
                onChange={(event) =>
                  updateForm("concern", event.target.value)
                }
                placeholder="Briefly describe what the patient needs help with."
                minLength={10}
                maxLength={1000}
                rows={5}
                required
              />
            </label>

            <label>
              Requested urgency
              <select
                value={form.urgency}
                onChange={(event) =>
                  updateForm(
                    "urgency",
                    event.target.value as IntakeForm["urgency"],
                  )
                }
              >
                <option value="routine">Routine</option>
                <option value="soon">Soon</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit care request"}
            </button>
          </form>
        </article>

        <article className="panel queue-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Live queue</p>
              <h2>Care workflows</h2>
            </div>
            <button
              className="text-button"
              type="button"
              onClick={() => void loadWorkflows()}
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>

          <div className="queue-summary">
            <span>{workflows.length} total requests</span>
            <span className="api-status">
              <span aria-hidden="true">●</span> API connected
            </span>
          </div>

          {isLoading ? (
            <p className="empty-state">Loading care requests...</p>
          ) : workflows.length === 0 ? (
            <p className="empty-state">
              No requests yet. Submit the first care intake from this page.
            </p>
          ) : (
            <div className="workflow-list">
              {workflows.map((workflow) => (
                <article className="workflow-card" key={workflow.id}>
                  <div className="workflow-card-header">
                    <div>
                      <h3>{workflow.patientName}</h3>
                      <p>{workflow.email}</p>
                    </div>
                    <span className={`status-chip status-${workflow.status}`}>
                      {workflow.status}
                    </span>
                  </div>

                  <p className="workflow-concern">{workflow.concern}</p>

                  <dl className="workflow-meta">
                    <div>
                      <dt>Urgency</dt>
                      <dd className={`urgency-${workflow.urgency}`}>
                        {workflow.urgency}
                      </dd>
                    </div>
                    <div>
                      <dt>Received</dt>
                      <dd>{formatDate(workflow.createdAt)}</dd>
                    </div>
                  </dl>

                  <label className="status-control">
                    Update status
                    <select
                      value={workflow.status}
                      disabled={updatingId === workflow.id}
                      onChange={(event) =>
                        void updateStatus(
                          workflow.id,
                          event.target.value as WorkflowStatus,
                        )
                      }
                    >
                      {workflowStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>

      {error ? (
        <p className="notification notification-error" role="alert">
          {error}
        </p>
      ) : null}

      {successMessage ? (
        <p className="notification notification-success" role="status">
          {successMessage}
        </p>
      ) : null}
    </main>
  );
}

export default App;