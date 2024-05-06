"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { hexRandomColor, roundTwoDecimals } from "./utils";

interface InnerRectangles {
  horizontal: number;
  items: {
    height: number;
    left: number;
    top: number;
    width: number;
    color: string;
  }[];
  total: number;
  vertical: number;
}

const calculateRectangles = (
  outerWidth: number,
  outerHeight: number,
  innerWidth: number,
  innerHeight: number
): InnerRectangles => {
  const outerLonger = Math.max(outerWidth, outerHeight);
  const outerShorter = Math.min(outerWidth, outerHeight);
  const innerLonger = Math.max(innerWidth, innerHeight);
  const innerShorter = Math.min(innerWidth, innerHeight);

  if (
    outerLonger < innerLonger ||
    outerHeight < innerHeight ||
    [outerWidth, outerHeight, innerWidth, innerHeight].some((item) => item <= 0)
  ) {
    // Inner rectangle is bigger than outer rectangle or some side is 0
    return { total: 0, horizontal: 0, vertical: 0, items: [] };
  }

  const xHorizontalCounter = Math.floor(outerLonger / innerLonger);
  const yHorizontalCounter = Math.floor(outerShorter / innerShorter);
  const horizontalCounter = xHorizontalCounter * yHorizontalCounter;

  // Calculate if in remaining space fit more rectangles in different position
  const xRemaingSpace = outerLonger - xHorizontalCounter * innerLonger;
  const verticalCounter = Math.floor(xRemaingSpace / innerShorter);

  const items: {
    height: number;
    left: number;
    top: number;
    width: number;
    color: string;
  }[] = [];
  for (let xIndex = 0; xIndex < xHorizontalCounter; xIndex++) {
    for (let yIndex = 0; yIndex < yHorizontalCounter; yIndex++) {
      items.push({
        color: hexRandomColor(),
        height: innerShorter,
        left: xIndex * innerLonger,
        top: yIndex * innerShorter,
        width: innerLonger,
      });
    }
  }
  if (verticalCounter) {
    for (let xIndex = 0; xIndex < verticalCounter; xIndex++) {
      items.push({
        color: hexRandomColor(),
        height: innerLonger,
        left: xHorizontalCounter * innerLonger + xIndex * innerShorter,
        top: 0,
        width: innerShorter,
      });
    }
  }

  return {
    horizontal: horizontalCounter,
    items,
    total: horizontalCounter + verticalCounter,
    vertical: verticalCounter,
  };
};

export default function Home(): JSX.Element {
  const roofElRef = useRef<HTMLDivElement>(null);
  const roofWidthInputRef = useRef<HTMLInputElement>(null);
  const graphElRef = useRef<HTMLDivElement>(null);
  const [roofDimensions, setRoofDimensions] = useState<{
    left: number;
    top: number;
    height: number;
    width: number;
  }>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
  });
  const [roofWidth, setRoofWidth] = useState(0);
  const [roofHeight, setRoofHeight] = useState(0);
  const [solarPanelWidth, setSolarPanelWidth] = useState(0);
  const [solarPanelHeight, setSolarPanelHeight] = useState(0);
  const [result, setResult] = useState<null | InnerRectangles>(null);
  const roofLongerSide = Math.max(roofWidth, roofHeight);
  const roofShorterSide = Math.min(roofWidth, roofHeight);

  const onCalculateClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (result !== null) {
      // Reset values and remove result
      setRoofWidth(0);
      setRoofHeight(0);
      setSolarPanelWidth(0);
      setSolarPanelHeight(0);
      setResult(null);
      return;
    }

    setResult(
      calculateRectangles(
        roofWidth,
        roofHeight,
        solarPanelWidth,
        solarPanelHeight
      )
    );
  };

  // Get roof dimensions
  useEffect(() => {
    if (result !== null && result.total > 0 && roofElRef.current) {
      const { left, top, width } = roofElRef.current.getBoundingClientRect();
      setRoofDimensions({
        left,
        top,
        width,
        height: (width * roofShorterSide) / roofLongerSide,
      });
    }
  }, [result, roofLongerSide, roofShorterSide]);

  // Set input focus on reset
  useEffect(() => {
    if (roofWidthInputRef.current && !result) {
      roofWidthInputRef.current.select();
      roofWidthInputRef.current.focus();
    }
  }, [result, roofWidthInputRef]);

  // Set scroll on calculation
  useEffect(() => {
    if (result !== null && result.total > 0 && graphElRef.current) {
      // Wait until rectangles are created into DOM before scrolling
      setTimeout(() => {
        graphElRef?.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [result, graphElRef]);

  // Recalculate graph on resize
  useEffect(() => {
    if (result !== null && result.total > 0) {
      const onResize = () => {
        if (roofElRef.current) {
          const { left, top, width } =
            roofElRef.current.getBoundingClientRect();
          setRoofDimensions({
            left,
            top,
            width,
            height: (width * roofShorterSide) / roofLongerSide,
          });
        }
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  }, [result, roofShorterSide, roofLongerSide]);

  return (
    <main className="flex min-h-screen min-w-80 flex-col max-w-5xl justify-start p-6 sm:p-12 sm:mx-auto md:p-24">
      <h1 className="text-3xl mb-6 text-center sm:text-4xl">
        Calculadora de Paneles Solares
      </h1>
      <p className="mb-8 text-justify">
        Introduzca las dimensiones del tejado y de los paneles solares para que
        el sistema calcule por usted cuántos paneles solares podría instalar en
        un tejado según las dimensiones dadas.
      </p>

      <form
        className="flex flex-col"
        onSubmit={($event) => onCalculateClick($event)}
      >
        <div id="roof" className="mb-3">
          <h3 className="font-bold text-primary mb-3">Tejado</h3>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div
              id="roofWidthContainer"
              className="flex flex-row flex-1 items-center"
            >
              <label htmlFor="roofWidth">Ancho:</label>
              <input
                type="number"
                name="roofWidth"
                id="roofWidth"
                ref={roofWidthInputRef}
                className="border-b-2 flex-1 outline-none focus:border-b-primary mx-2"
                value={roofWidth}
                disabled={result !== null}
                onChange={($event) => setRoofWidth(+$event.target.value)}
              />
              cm
            </div>

            <div
              id="roofHeightContainer"
              className="flex flex-row flex-1 items-center"
            >
              <label htmlFor="roofHeight">Alto:</label>
              <input
                type="number"
                name="roofHeight"
                id="roofHeight"
                className="border-b-2 flex-1 outline-none focus:border-b-primary mx-2"
                value={roofHeight}
                disabled={result !== null}
                onChange={($event) => setRoofHeight(+$event.target.value)}
              />
              cm
            </div>
          </div>
        </div>

        <div id="solarPanel" className="mb-3">
          <h3 className="font-bold text-primary mb-3">Paneles solares</h3>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div
              id="solarPanelWidthContainer"
              className="flex flex-row flex-1 items-center"
            >
              <label htmlFor="solarPanelWidth">Ancho:</label>
              <input
                type="number"
                name="solarPanelWidth"
                id="solarPanelWidth"
                className="border-b-2 flex-1 outline-none focus:border-b-primary mx-2"
                value={solarPanelWidth}
                disabled={result !== null}
                onChange={($event) => setSolarPanelWidth(+$event.target.value)}
              />
              cm
            </div>

            <div
              id="solarPanelHeightContainer"
              className="flex flex-row flex-1 items-center"
            >
              <label htmlFor="solarPanelHeight">Alto:</label>
              <input
                type="number"
                name="solarPanelHeight"
                id="solarPanelHeight"
                className="border-b-2 flex-1 outline-none focus:border-b-primary mx-2"
                value={solarPanelHeight}
                disabled={result !== null}
                onChange={($event) => setSolarPanelHeight(+$event.target.value)}
              />
              cm
            </div>
          </div>
        </div>

        <button
          id="calculateButton"
          type="submit"
          className="px-3 py-2 rounded-xl bg-primary text-white mt-5 disabled:bg-disabled sm:mx-auto sm:w-fit min-w-36"
          disabled={
            !(roofWidth && roofHeight && solarPanelWidth && solarPanelHeight)
          }
        >
          {result !== null ? "Reiniciar" : "Calcular"}
        </button>
      </form>
      {result !== null && (
        <div className="flex flex-col" ref={graphElRef}>
          <div className="text-center mt-6">
            <p>
              Nº de Paneles Solares:{" "}
              <span className="text-primary font-bold">{result.total}</span>
            </p>
            <p>
              De los cuales{" "}
              <span className="text-primary font-bold">
                {result.horizontal}
              </span>{" "}
              están en horizontal y{" "}
              <span className="text-primary font-bold">{result.vertical}</span>{" "}
              en vertical.
            </p>
            <p>
              La superficie desperdiciada es del{" "}
              <span className="text-primary font-bold">
                {roundTwoDecimals(
                  100 -
                    (solarPanelWidth * solarPanelHeight * result.total * 100) /
                      (roofWidth * roofHeight)
                )}
                %
              </span>
              .
            </p>
          </div>
          {result.total > 0 && (
            <div className="flex flex-col gap-1 mt-6">
              <h2 className="md:text-lg">Visualización</h2>
              <div
                ref={roofElRef}
                className="bg-slate-100 w-full relative text-white"
                style={{ height: roofDimensions.height }}
              >
                {result.items.map((solarPanel, index) => (
                  <div
                    key={index}
                    className="absolute flex justify-center items-center text-center text-sm md:text-base"
                    style={{
                      left:
                        (roofDimensions.width / roofLongerSide) *
                        solarPanel.left,
                      top:
                        (roofDimensions.width / roofLongerSide) *
                        solarPanel.top,
                      height:
                        (roofDimensions.width / roofLongerSide) *
                        solarPanel.height,
                      width:
                        (roofDimensions.width / roofLongerSide) *
                        solarPanel.width,
                      backgroundColor: solarPanel.color,
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
