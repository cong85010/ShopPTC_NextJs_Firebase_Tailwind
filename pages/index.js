import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full-remove-nav flex flex-col items-center justify-center">
      <h1 className="text-7xl font-bold ">Wear better, look better.</h1>
      <p className="mt-10 mb-10 text-xl">
        Don't you just love being in apparel?
      </p>
      <Link href="/collections">
        <button className="p-3 bg-blue-600 text-white text-xl rounded-md shadow-lg shadow-blue-500/50 hover:shadow-cyan-500/50">
          Shop Now
        </button>
      </Link>
    </div>
  );
}
