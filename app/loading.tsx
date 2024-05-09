import SpinnerIcon from "./_components/_icons/spinner-icon";

export default function Loading(): JSX.Element {
  return (
    <p className="flex items-center justify-center h-screen w-screen text-primary text-xl">
      <SpinnerIcon className="mr-3 w-10 h-10 animate-spin" />
      Loading...
    </p>
  );
}
