export default function Loading(): JSX.Element {
  return (
    <p className="flex items-center justify-center h-screen w-screen text-primary text-xl">
      <svg
        className="mr-3 w-10 h-10 animate-spin"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1_2_31" fill="white">
          <path d="M100 50C100 77.6142 77.6142 100 50 100V90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50H0C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z" />
        </mask>
        <path
          d="M100 50C100 77.6142 77.6142 100 50 100V90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50H0C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z"
          fill="white"
        />
        <path
          id="icon"
          d="M50 100H40V110H50V100ZM50 90V80H40V90H50ZM10 50V60H20V50H10ZM0 50H-10V60H0V50ZM50 110C83.1371 110 110 83.1371 110 50H90C90 72.0914 72.0914 90 50 90V110ZM40 90V100H60V90H40ZM80 50C80 66.5685 66.5685 80 50 80V100C77.6142 100 100 77.6142 100 50H80ZM50 20C66.5685 20 80 33.4315 80 50H100C100 22.3858 77.6142 0 50 0V20ZM20 50C20 33.4315 33.4315 20 50 20V0C22.3858 0 0 22.3858 0 50H20ZM0 60H10V40H0V60ZM50 -10C16.8629 -10 -10 16.8629 -10 50H10C10 27.9086 27.9086 10 50 10V-10ZM110 50C110 16.8629 83.1371 -10 50 -10V10C72.0914 10 90 27.9086 90 50H110Z"
          fill="currentColor"
          mask="url(#path-1-inside-1_2_31)"
        />
      </svg>
      Loading...
    </p>
  );
}
