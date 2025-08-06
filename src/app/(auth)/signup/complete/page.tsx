import Client from "../../_components/Client";
import SignupCompleteForm from "./completeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UniStuff | 회원가입 페이지",
  description: "UniStuff의 회원가입 페이지 입니다",
};
export default function SignupCompletePage() {
  return (
    <Client>
      <SignupCompleteForm />
    </Client>
  );
}
