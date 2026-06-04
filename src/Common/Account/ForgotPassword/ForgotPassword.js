import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPasswordApi, resetPasswordApi, resendOtpApi } from "../../../services/authApi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [step, setStep] = useState("request");
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await forgotPasswordApi({ email: form.email });
      toast.success(response?.message || "Da gui OTP dat lai mat khau.");
      setStep("reset");
    } catch (error) {
      toast.error(error?.message || "Khong the gui OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendingOtp(true);
      const response = await resendOtpApi({ email: form.email });
      toast.success(response?.message || "Da gui lai OTP.");
    } catch (error) {
      toast.error(error?.message || "Khong the gui lai OTP.");
    } finally {
      setResendingOtp(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (form.newPassword.length < 8) {
      toast.error("Mat khau moi phai tu 8 ky tu tro len.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mat khau xac nhan khong khop.");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPasswordApi({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success(response?.message || "Dat lai mat khau thanh cong.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.message || "Dat lai mat khau that bai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8fcf9] text-[#0d1b10] font-display">
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-[#f8fcf9] lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#0d1b10]">
              {step === "request" ? "Quen mat khau" : "Dat lai mat khau"}
            </h2>
            <p className="mt-2 text-sm text-[#4c9a59]">
              {step === "request"
                ? "Nhap email da dang ky de nhan ma OTP."
                : `Nhap OTP da gui den ${form.email} va mat khau moi.`}
            </p>
          </div>

          {step === "request" ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-[#0d1b10]"
                  htmlFor="email"
                >
                  Dia chi email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ban@example.com"
                  className="mt-2 block w-full rounded-lg border border-[#e7f3e9] py-3 px-4 bg-white text-[#0d1b10] focus:ring-2 focus:ring-[#13ec37] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-[#13ec37] px-3 py-3 text-sm font-bold leading-6 text-[#0d1b10] shadow-sm hover:bg-[#0fd630] transition-colors disabled:opacity-70"
              >
                {loading ? "Dang xu ly..." : "Gui OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium leading-6 text-[#0d1b10]" htmlFor="otp">
                  Ma OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={form.otp}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg border border-[#e7f3e9] py-3 px-4 bg-white text-[#0d1b10] focus:ring-2 focus:ring-[#13ec37] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-[#0d1b10]" htmlFor="newPassword">
                  Mat khau moi
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  value={form.newPassword}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg border border-[#e7f3e9] py-3 px-4 bg-white text-[#0d1b10] focus:ring-2 focus:ring-[#13ec37] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-[#0d1b10]" htmlFor="confirmPassword">
                  Xac nhan mat khau moi
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-lg border border-[#e7f3e9] py-3 px-4 bg-white text-[#0d1b10] focus:ring-2 focus:ring-[#13ec37] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-[#13ec37] px-3 py-3 text-sm font-bold leading-6 text-[#0d1b10] shadow-sm hover:bg-[#0fd630] transition-colors disabled:opacity-70"
              >
                {loading ? "Dang xu ly..." : "Dat lai mat khau"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendingOtp}
                className="flex w-full justify-center rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-bold leading-6 text-[#0d1b10] hover:bg-gray-50 transition-colors disabled:opacity-70"
              >
                {resendingOtp ? "Dang gui lai OTP..." : "Gui lai OTP"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="font-semibold text-[#13ec37] hover:underline">
              Quay lai dang nhap
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block bg-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
        <img
          alt="La tra xanh tuoi"
          className="absolute inset-0 h-full w-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzJoYFXp5Vuo6jrFHz0xwlgRUv5ybaa5XISoU77DwNHPC78-TjmCi0rxPSFNjy37FeKsNyqEK0RVp56tBuF_XiqVXVbDocvGjXPnaAEVBFsnVJvBaIH8oON145-uq3_h7FpNnpmCqadxqzaIvMpLQ_TwUVk1ZcPB6PN_2YYQovj-R7L3GO2zFeMiEhMv-ct3_afww2KaY1tpnMgf1-FVGPs1gDgAlP8DA2de90N3DexhyxXFGmXtK36GmN0IhOveI4PfbzSiDfAKiV"
        />
      </div>
    </div>
  );
}
