import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex p-5 justify-between sticky top-0 bg-white z-50 shadow-md">
      {/* left */}
      <div className="flex space-x-2 items-center">
        <Image src="/open-ai-logo.png" alt="logo" height={30} width={30} />

        <div>
          <h1 className="font-bold">
            The PAPAFAM <span className="text-violet-500">AI</span> Image
            Generator
          </h1>
          <h2 className="text-xs">
            Powered by DALL·E 2, Chat GPT & Microsoft Azure!
          </h2>
        </div>
      </div>

      {/* right */}
      <div className="flex text-xs md:text-base divide-x items-center text-gray-500">
        <Link
          href="https://www.papareact.com"
          className="px-2 text-right font-light"
        >
          Join Zero To Full Stack Hero
        </Link>
        <Link
          href="https://links.papareact.com/microsoft-youtube-build"
          className="px-2 font-light"
        >
          Github Repo
        </Link>
      </div>
    </header>
  );
}
