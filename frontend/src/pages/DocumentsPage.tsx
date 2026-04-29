import { useState, useRef, type FormEvent } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { useDocuments, useUploadDocument, useDeleteDocument } from "../hooks/useDocuments";
import { getDocumentDownloadUrl } from "../services/documents";
import { FileText, Upload, Trash2, Download, Loader2, File } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "Word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
  "image/jpeg": "Image",
  "image/png": "Image",
  "text/plain": "Texte",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function DocumentsPage() {
  const { data: user } = useCurrentUser();
  const { data: docs = [], isLoading } = useDocuments();
  const upload = useUploadDocument();
  const deleteDoc = useDeleteDocument();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file || !title) return;
    await upload.mutateAsync({ title, file });
    setTitle("");
    setFile(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-500 text-sm mt-1">Ressources pédagogiques partagées par les tuteurs</p>
        </div>
        {user && (
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 text-sm">
            <Upload className="h-4 w-4" />
            {showForm ? "Annuler" : "Déposer un document"}
          </Button>
        )}
      </div>

      {/* Upload form */}
      {showForm && (
        <form onSubmit={handleUpload} className="rounded-2xl border border-blue-100 bg-blue-50 p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">Déposer un document</h2>
          <Input
            label="Titre du document"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Cours de comptabilité - Chapitre 3"
          />
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            <span>Fichier (PDF, Word, Image, Texte — max 10MB)</span>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </label>
          <Button type="submit" disabled={upload.isPending || !file || !title} className="flex items-center gap-2">
            {upload.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi...</> : <><Upload className="h-4 w-4" /> Envoyer</>}
          </Button>
        </form>
      )}

      {/* Documents list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <article key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 truncate">{doc.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{doc.file_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {MIME_LABELS[doc.mime_type] ?? "Fichier"}
                  </span>
                  <span className="text-xs text-slate-400">{formatSize(doc.file_size)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {new Date(doc.created_at).toLocaleDateString("fr-FR")}
            </p>
            <div className="flex gap-2 mt-auto">
              <a
                href={getDocumentDownloadUrl(doc.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                download
              >
                <Download className="h-3.5 w-3.5" /> Télécharger
              </a>
              {user && doc.uploader_id === user.id && (
                <button
                  onClick={() => deleteDoc.mutate(doc.id)}
                  className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </article>
        ))}
        {docs.length === 0 && (
          <div className="col-span-3 py-16 text-center">
            <File className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">Aucun document disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
