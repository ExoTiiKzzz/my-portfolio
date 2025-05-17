import React, {type ChangeEvent, type FormEvent, useState} from "react";
import { motion } from "framer-motion";
import MotionWrapper from "./MotionWrapper";
import { GlassCard } from "./ui/glass-card";

interface ApiError {
  message: string;
  rule: string;
  field: string;
}

interface ApiErrorData {
  errors: ApiError[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleChange = (e : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({
        name: "",
        email: "",
        message: "",
        submit: "",
    });

    try {
      const response = await fetch("http://localhost:3334/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorData: ApiErrorData = await response.json();
        const fieldErrors: { [key: string]: string } = {};
        errorData.errors.forEach(error => {
          fieldErrors[error.field] = error.message;
        });

        setErrors({
          ...errors,
          ...fieldErrors,
          submit: "Une erreur s'est produite. Veuillez réessayer.",
        });
      }
    } catch (error) {
        setSubmitStatus("error");
        setErrors({
          ...errors,
          submit: "Une erreur s'est produite. Veuillez réessayer.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
      <section
          id="contact"
          className="py-12 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container max-w-4xl mx-auto px-6 md:px-4">
          <MotionWrapper>
            <h2 className="text-2xl font-bold mb-8 text-center md:text-left">
              📬 Contact
            </h2>
          </MotionWrapper>

          <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div>
              <GlassCard className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                      <label htmlFor="name" className="block mb-1 font-medium">
                        Name
                      </label>
                      <input
                          type="text"
                          id="name"
                          name="name"
                          autoComplete="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`w-full p-2 border rounded ${
                              errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="flex-1">
                      <label htmlFor="email" className="block mb-1 font-medium">
                        Email
                      </label>
                      <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`w-full p-2 border rounded ${
                              errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block mb-1 font-medium">
                      Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        required
                        className={`w-full p-2 border rounded ${
                            errors.message ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.message && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.message}
                        </p>
                    )}
                  </div>

                  {errors.submit && (
                      <p className="mt-1 text-sm text-red-500">{errors.submit}</p>
                  )}

                  {submitStatus === "success" && (
                      <p className="mt-1 text-sm text-green-500">
                        Votre message a été envoyé avec succès ! Je vous répondrai
                        dès que possible.
                      </p>
                  )}

                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl hover:cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
}
