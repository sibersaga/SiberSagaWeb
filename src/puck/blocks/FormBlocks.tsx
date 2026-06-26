import React, { useState } from "react";
import { DropZone } from "@puckeditor/core";
import { isSupabaseConfigured, getSupabase } from "../../supabase";

export const FormWrapperBlockConfig = {
  fields: {
    formName: { type: "text" as const, label: "Nama Form (ID Unik)" },
    submitAction: {
      type: "select" as const,
      label: "Aksi Submit",
      options: [
        { label: "Simpan ke Database (Supabase)", value: "database" },
        { label: "Kirim ke Email (Formspree / EmailJS)", value: "email" },
        { label: "Kirim ke Webhook (POST JSON)", value: "webhook" },
        { label: "Kirim ke Google Sheets", value: "google-sheets" },
        { label: "Custom Action URL", value: "custom" },
      ],
    },
    actionUrl: { type: "text" as const, label: "Action URL (untuk Custom / Email service)" },
    emailTo: { type: "text" as const, label: "Email Tujuan (untuk Email mode)" },
    webhookUrl: { type: "text" as const, label: "Webhook URL (POST JSON)" },
    googleSheetsUrl: { type: "text" as const, label: "Google Apps Script URL" },
    redirectUrl: { type: "text" as const, label: "Redirect URL Setelah Submit (opsional)" },
    enableValidation: { type: "boolean" as const, label: "Aktifkan Validasi HTML5" },
    successMessage: { type: "text" as const, label: "Pesan Sukses" },
    errorMessage: { type: "text" as const, label: "Pesan Error" },
    buttonText: { type: "text" as const, label: "Teks Tombol Submit" },
    buttonColor: { type: "text" as const, label: "Warna Tombol (Hex)" },
    buttonStyle: {
      type: "select" as const,
      label: "Gaya Tombol",
      options: [
        { label: "Solid (Penuh)", value: "solid" },
        { label: "Outline (Garis)", value: "outline" },
        { label: "Gradient", value: "gradient" },
      ],
    },
  },
  defaultProps: {
    formName: "contact-form",
    submitAction: "database",
    actionUrl: "",
    emailTo: "",
    webhookUrl: "",
    googleSheetsUrl: "",
    redirectUrl: "",
    enableValidation: true,
    successMessage: "Terima kasih! Formulir berhasil dikirim.",
    errorMessage: "Maaf, terjadi kesalahan saat mengirim formulir.",
    buttonText: "Kirim Formulir",
    buttonColor: "#2563eb",
    buttonStyle: "solid",
  },
  render: function FormWrapperRender({
    formName,
    submitAction,
    actionUrl,
    emailTo,
    webhookUrl,
    googleSheetsUrl,
    redirectUrl,
    enableValidation,
    successMessage,
    errorMessage,
    buttonText,
    buttonColor,
    buttonStyle,
  }: any) {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const collectFormData = (form: HTMLFormElement): Record<string, string> => {
      const data: Record<string, string> = {};
      const formData = new FormData(form);
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });
      data._formName = formName;
      data._submittedAt = new Date().toISOString();
      return data;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;

      if (enableValidation && !form.checkValidity()) {
        form.reportValidity();
        return;
      }

      setStatus("sending");
      const data = collectFormData(form);

      try {
        let success = false;

        switch (submitAction) {
          case "database": {
            if (isSupabaseConfigured) {
              const { error } = await getSupabase()
                .from("settings")
                .upsert({
                  key: `form_submission_${formName}_${Date.now()}`,
                  value: data,
                }, { onConflict: "key" });
              success = !error;
              if (error) console.error("DB submit error:", error);
            } else {
              // Fallback: save to localStorage
              const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]");
              existing.push(data);
              localStorage.setItem("form_submissions", JSON.stringify(existing));
              success = true;
            }
            break;
          }

          case "email": {
            const url = actionUrl || `https://formspree.io/f/${emailTo}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify(data),
            });
            success = res.ok;
            break;
          }

          case "webhook": {
            if (!webhookUrl) {
              alert("Webhook URL belum diatur!");
              setStatus("error");
              return;
            }
            const res = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            success = res.ok;
            break;
          }

          case "google-sheets": {
            if (!googleSheetsUrl) {
              alert("Google Sheets URL belum diatur!");
              setStatus("error");
              return;
            }
            const res = await fetch(googleSheetsUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
              mode: "no-cors", // Google Apps Script requires no-cors
            });
            // no-cors always returns opaque response, assume success
            success = true;
            break;
          }

          case "custom": {
            if (!actionUrl) {
              alert("Action URL belum diatur!");
              setStatus("error");
              return;
            }
            const res = await fetch(actionUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            success = res.ok;
            break;
          }

          default:
            success = false;
        }

        if (success) {
          setStatus("success");
          form.reset();
          if (redirectUrl) {
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1500);
          }
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Form submission error:", err);
        setStatus("error");
      }
    };

    // Button styling
    const btnBase: React.CSSProperties = {
      marginTop: "1rem",
      padding: "0.85rem 1.5rem",
      border: "none",
      borderRadius: "0.5rem",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      fontSize: "1rem",
      transition: "all 0.2s ease",
      letterSpacing: "0.01em",
    };

    if (buttonStyle === "solid") {
      btnBase.backgroundColor = buttonColor;
      btnBase.color = "white";
    } else if (buttonStyle === "outline") {
      btnBase.backgroundColor = "transparent";
      btnBase.color = buttonColor;
      btnBase.border = `2px solid ${buttonColor}`;
    } else if (buttonStyle === "gradient") {
      btnBase.background = `linear-gradient(135deg, ${buttonColor}, ${buttonColor}cc)`;
      btnBase.color = "white";
      btnBase.boxShadow = `0 4px 14px ${buttonColor}44`;
    }

    return (
      <form
        onSubmit={handleSubmit}
        noValidate={!enableValidation}
        style={{
          width: "100%",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
          borderRadius: "0.75rem",
          backgroundColor: "white",
        }}
      >
        <DropZone zone="form-fields" />

        {/* Status Messages */}
        {status === "success" && (
          <div style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "0.5rem",
            color: "#065f46",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}>
            ✓ {successMessage}
          </div>
        )}
        {status === "error" && (
          <div style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "0.5rem",
            color: "#991b1b",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}>
            ✕ {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            ...btnBase,
            opacity: status === "sending" ? 0.6 : 1,
          }}
        >
          {status === "sending" ? "Mengirim..." : buttonText}
        </button>

        {/* Submit Action Hint (Editor Only) */}
        {typeof window !== "undefined" && window.location.pathname.includes("/admin") && (
          <div style={{
            marginTop: "0.75rem",
            padding: "0.5rem 0.75rem",
            backgroundColor: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "0.375rem",
            fontSize: "0.7rem",
            color: "#0369a1",
            fontWeight: 500,
          }}>
            📋 Submit: <b>{submitAction}</b>
            {submitAction === "email" && emailTo && <> → {emailTo}</>}
            {submitAction === "webhook" && webhookUrl && <> → {webhookUrl.substring(0, 40)}...</>}
            {submitAction === "google-sheets" && <> → Google Sheets</>}
            {redirectUrl && <> | Redirect → {redirectUrl}</>}
          </div>
        )}
      </form>
    );
  },
};

const commonInputFields = {
  label: { type: "text" as const },
  name: { type: "text" as const },
  required: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
};

const commonInputProps = {
  label: "Field Label",
  name: "field_name",
  required: "false",
};

export const InputTextBlockConfig = {
  fields: {
    ...commonInputFields,
    type: {
      type: "select" as const,
      options: [
        { label: "Text", value: "text" },
        { label: "Email", value: "email" },
        { label: "Password", value: "password" },
        { label: "Number", value: "number" },
        { label: "Tel", value: "tel" },
      ],
    },
    placeholder: { type: "text" as const },
  },
  defaultProps: {
    ...commonInputProps,
    label: "Full Name",
    name: "full_name",
    type: "text",
    placeholder: "John Doe",
  },
  render: ({ label, name, required, type, placeholder }: any) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          {label} {required === "true" && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <input
          type={type}
          name={name}
          required={required === "true"}
          placeholder={placeholder}
          style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.375rem" }}
        />
      </div>
    );
  },
};

export const TextareaBlockConfig = {
  fields: {
    ...commonInputFields,
    placeholder: { type: "text" as const },
    rows: { type: "number" as const },
  },
  defaultProps: {
    ...commonInputProps,
    label: "Message",
    name: "message",
    placeholder: "How can we help you?",
    rows: 4,
  },
  render: ({ label, name, required, placeholder, rows }: any) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          {label} {required === "true" && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <textarea
          name={name}
          required={required === "true"}
          placeholder={placeholder}
          rows={rows}
          style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.375rem" }}
        />
      </div>
    );
  },
};

export const CheckboxBlockConfig = {
  fields: {
    name: { type: "text" as const },
    label: { type: "text" as const },
    required: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
  },
  defaultProps: {
    name: "terms",
    label: "I agree to the terms and conditions",
    required: "true",
  },
  render: ({ name, label, required }: any) => {
    return (
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input type="checkbox" name={name} required={required === "true"} id={name} />
        <label htmlFor={name} style={{ fontWeight: 500 }}>
          {label} {required === "true" && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      </div>
    );
  },
};

export const RadioBlockConfig = {
  fields: {
    ...commonInputFields,
    options: {
      type: "array" as const,
      arrayFields: {
        label: { type: "text" as const },
        value: { type: "text" as const },
      },
    },
  },
  defaultProps: {
    ...commonInputProps,
    label: "Gender",
    name: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  render: ({ label, name, required, options }: any) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          {label} {required === "true" && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {options.map((opt: any, i: number) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 500 }}>
              <input type="radio" name={name} value={opt.value} required={required === "true"} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    );
  },
};

export const SelectBlockConfig = {
  fields: {
    ...commonInputFields,
    placeholder: { type: "text" as const },
    options: {
      type: "array" as const,
      arrayFields: {
        label: { type: "text" as const },
        value: { type: "text" as const },
      },
    },
  },
  defaultProps: {
    ...commonInputProps,
    label: "Service",
    name: "service",
    placeholder: "Select a service...",
    options: [
      { label: "Web Development", value: "web" },
      { label: "Mobile App", value: "mobile" },
      { label: "SEO", value: "seo" },
    ],
  },
  render: ({ label, name, required, placeholder, options }: any) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          {label} {required === "true" && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <select
          name={name}
          required={required === "true"}
          style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.375rem", backgroundColor: "white" }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt: any, i: number) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  },
};

export const DatePickerBlockConfig = {
  fields: {
    ...commonInputFields,
  },
  defaultProps: {
    ...commonInputProps,
    label: "Select Date",
    name: "date",
  },
  render: ({ label, name, required }: any) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          {label} {required === "true" && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <input
          type="date"
          name={name}
          required={required === "true"}
          style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.375rem" }}
        />
      </div>
    );
  },
};

export const FileUploadBlockConfig = {
  fields: {
    ...commonInputFields,
    accept: { type: "text" as const }, // e.g. "image/*, .pdf"
  },
  defaultProps: {
    ...commonInputProps,
    label: "Upload Resume",
    name: "resume",
    accept: ".pdf,.doc,.docx",
  },
  render: ({ label, name, required, accept }: any) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
          {label} {required === "true" && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <input
          type="file"
          name={name}
          required={required === "true"}
          accept={accept}
          style={{ width: "100%", padding: "0.5rem", border: "1px dashed #d1d5db", borderRadius: "0.375rem", backgroundColor: "#f9fafb" }}
        />
      </div>
    );
  },
};
