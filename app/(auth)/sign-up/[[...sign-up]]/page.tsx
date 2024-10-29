import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
export default function Page() {
  return (
    <div className="flex justify-center min-h-[75vh] items-center">
      <SignUp appearance={{ baseTheme: dark }} />
    </div>
  );
}
