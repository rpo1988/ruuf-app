import Link from "next/link";
import CloseIcon from "./_components/_icons/close-icon";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-lg gap-6 max-w-[400px] mx-auto">
      <CloseIcon className="w-40 h-40 text-primary-lighter" />
      <h2 className="text-4xl font-bold">Uuups...</h2>
      <p className="text-center">
        Lo sentimos. La página solicitada no ha sido encontrada.
      </p>
      <Link href={"/"} className="btn btn-primary">
        Ir a Inicio
      </Link>
    </div>
  );
}
