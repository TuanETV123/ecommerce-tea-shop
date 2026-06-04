import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerApi, resendOtpApi, verifyOtpApi } from "../../../services/authApi";

const REGISTER_STEP = {
  FORM: "form",
  OTP: "otp",
};

const Register = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(REGISTER_STEP.FORM);
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const canSubmit = useMemo(() => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword
    );
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!canSubmit) {
      toast.error("Vui long nhap dung thong tin dang ky.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };
      const response = await registerApi(payload);
      toast.success(response?.message || "Dang ky thanh cong. Vui long nhap OTP.");
      setStep(REGISTER_STEP.OTP);
    } catch (error) {
      toast.error(error?.message || "Dang ky that bai.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!formData.otp.trim()) {
      toast.error("Vui long nhap ma OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtpApi({
        email: formData.email,
        otp: formData.otp,
      });
      toast.success(response?.message || "Xac thuc email thanh cong.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.message || "Xac thuc OTP that bai.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendingOtp(true);
      const response = await resendOtpApi({ email: formData.email });
      toast.success(response?.message || "Da gui lai ma OTP.");
    } catch (error) {
      toast.error(error?.message || "Khong the gui lai OTP.");
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-display">
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-background-light lg:w-1/2 relative">
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Ve cua hang
        </Link>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight text-[#0d1b10] mb-3">
              {step === REGISTER_STEP.FORM ? "Tao tai khoan" : "Xac thuc email"}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {step === REGISTER_STEP.FORM
                ? "Dang ky de theo doi don hang, luu yeu thich va tich diem thanh vien."
                : `Nhap ma OTP da gui den ${formData.email}.`}
            </p>
          </div>

          {step === REGISTER_STEP.FORM ? (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-bold leading-6 text-[#0d1b10] mb-2"
                >
                  Ho va ten
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-3 px-4 text-[#0d1b10] bg-white focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="Vi du: Nguyen Van A"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold leading-6 text-[#0d1b10] mb-2"
                >
                  Dia chi email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-3 px-4 text-[#0d1b10] bg-white focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold leading-6 text-[#0d1b10] mb-2"
                >
                  Mat khau
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-3 px-4 text-[#0d1b10] bg-white focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="Toi thieu 8 ky tu"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold leading-6 text-[#0d1b10] mb-2"
                >
                  Xac nhan mat khau
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-3 px-4 text-[#0d1b10] bg-white focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="Nhap lai mat khau"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Mat khau xac nhan khong khop.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 h-12 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-md text-[#0d1b10] text-base font-bold disabled:opacity-70"
              >
                {loading ? "Dang xu ly..." : "Tao tai khoan"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-bold leading-6 text-[#0d1b10] mb-2"
                >
                  Ma OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-3 px-4 text-[#0d1b10] bg-white focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  placeholder="Nhap ma OTP"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-md text-[#0d1b10] text-base font-bold disabled:opacity-70"
              >
                {loading ? "Dang xu ly..." : "Xac thuc"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendingOtp}
                className="w-full h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#0d1b10] text-base font-bold disabled:opacity-70"
              >
                {resendingOtp ? "Dang gui lai..." : "Gui lai OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(REGISTER_STEP.FORM)}
                className="text-primary font-bold hover:underline"
              >
                Quay lai
              </button>
            </form>
          )}

          <p className="text-center mt-8 text-sm text-gray-500 font-medium">
            Da co tai khoan?{" "}
            <button
              onClick={() =>
                onBackToLogin ? onBackToLogin() : navigate("/login")
              }
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Dang nhap
            </button>
          </p>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block bg-[#ecf6ee]">
        <div className="absolute inset-0 bg-gradient-to-t from-background-light/40 to-transparent z-10"></div>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzJoYFXp5Vuo6jrFHz0xwlgRUv5ybaa5XISoU77DwNHPC78-TjmCi0rxPSFNjy37FeKsNyqEK0RVp56tBuF_XiqVXVbDocvGjXPnaAEVBFsnVJvBaIH8oON145-uq3_h7FpNnpmCqadxqzaIvMpLQ_TwUVk1ZcPB6PN_2YYQovj-R7L3GO2zFeMiEhMv-ct3_afww2KaY1tpnMgf1-FVGPs1gDgAlP8DA2de90N3DexhyxXFGmXtK36GmN0IhOveI4PfbzSiDfAKiV"
          alt="Serene matcha tea setup"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
      </div>
    </div>
  );
};

export default Register;
