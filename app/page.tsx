"use client";

import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import Input from "./_components/_form/input";
import ExclamationTriangleIcon from "./_components/_icons/exclamation-triangle";
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

const getInnerRectangles = (
  outerWidth: number,
  outerHeight: number,
  innerWidth: number,
  innerHeight: number
): InnerRectangles => {
  if (
    !(
      (outerWidth > innerWidth && outerHeight > innerHeight) ||
      (outerWidth > innerHeight && outerHeight > innerWidth)
    ) ||
    [outerWidth, outerHeight, innerWidth, innerHeight].some((item) => item <= 0)
  ) {
    // Inner rectangle is bigger than outer rectangle or some side is 0
    return { total: 0, horizontal: 0, vertical: 0, items: [] };
  }

  // Trying horizontal position
  const xHorizontalCounter = Math.floor(outerWidth / innerWidth);
  const yHorizontalCounter = Math.floor(outerHeight / innerHeight);
  const horizontalCounter = xHorizontalCounter * yHorizontalCounter;
  // Calculate if in x remaining space fit more rectangles in opposite position
  let remainingSpace = outerWidth - xHorizontalCounter * innerWidth;
  let xVerticalCounter = Math.floor(remainingSpace / innerHeight);
  let yVerticalCounter = Math.floor(outerHeight / innerWidth);
  let verticalCounter = xVerticalCounter * yVerticalCounter;
  let isOpposite = false;
  if (!verticalCounter) {
    isOpposite = true;
    // Calculate if in y remaining space fit more rectangles in opposite position
    remainingSpace = outerHeight - yHorizontalCounter * innerHeight;
    xVerticalCounter = Math.floor(remainingSpace / innerWidth);
    yVerticalCounter = Math.floor(outerWidth / innerHeight);
    verticalCounter = xVerticalCounter * yVerticalCounter;
  }

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
        height: innerHeight,
        left: xIndex * innerWidth,
        top: yIndex * innerHeight,
        width: innerWidth,
      });
    }
  }
  if (verticalCounter) {
    for (let xIndex = 0; xIndex < xVerticalCounter; xIndex++) {
      for (let yIndex = 0; yIndex < yVerticalCounter; yIndex++) {
        items.push({
          color: hexRandomColor(),
          height: innerWidth,
          left: isOpposite ? yIndex * innerHeight : outerWidth - remainingSpace,
          top: isOpposite ? outerHeight - remainingSpace : yIndex * innerWidth,
          width: innerHeight,
        });
      }
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
  const [viewRoofDimensions, setRoofDimensions] = useState<{
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
  const [inputRoofWidth, setRoofWidth] = useState(0);
  const [inputRoofHeight, setRoofHeight] = useState(0);
  const [inputSolarPanelWidth, setSolarPanelWidth] = useState(0);
  const [inputSolarPanelHeight, setSolarPanelHeight] = useState(0);
  const [result, setResult] = useState<null | InnerRectangles>(null);
  const [oppositeResult, setOppositeResult] = useState<null | InnerRectangles>(
    null
  );

  const onCalculateClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (result !== null) {
      // Reset values and remove result
      setRoofWidth(0);
      setRoofHeight(0);
      setSolarPanelWidth(0);
      setSolarPanelHeight(0);
      setResult(null);
      setOppositeResult(null);
      return;
    }

    setResult(
      getInnerRectangles(
        inputRoofWidth,
        inputRoofHeight,
        inputSolarPanelWidth,
        inputSolarPanelHeight
      )
    );
    setOppositeResult(
      getInnerRectangles(
        inputRoofWidth,
        inputRoofHeight,
        inputSolarPanelHeight,
        inputSolarPanelWidth
      )
    );
  };

  // Get roof dimensions
  useLayoutEffect(() => {
    if (result !== null && result.total > 0 && roofElRef.current) {
      const { left, top, width } = roofElRef.current.getBoundingClientRect();
      setRoofDimensions({
        left,
        top,
        width,
        height: (width * inputRoofHeight) / inputRoofWidth,
      });
    }
  }, [result, inputRoofWidth, inputRoofHeight]);

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
    if (result !== null && result.total > 0 && roofElRef.current) {
      const onResize = () => {
        if (roofElRef.current) {
          const { left, top, width } =
            roofElRef.current.getBoundingClientRect();
          setRoofDimensions({
            left,
            top,
            width,
            height: (width * inputRoofHeight) / inputRoofWidth,
          });
        }
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  }, [result, inputRoofWidth, inputRoofHeight]);

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
            <Input
              className="flex-1"
              label="Ancho:"
              id="roofWidth"
              type="number"
              innerRef={roofWidthInputRef}
              value={inputRoofWidth}
              disabled={result !== null}
              onChange={(value) => setRoofWidth(value as number)}
            />
            <Input
              className="flex-1"
              label="Alto:"
              id="roofHeight"
              type="number"
              value={inputRoofHeight}
              disabled={result !== null}
              onChange={(value) => setRoofHeight(value as number)}
            />
          </div>
        </div>

        <div id="solarPanel" className="mb-3">
          <h3 className="font-bold text-primary mb-3">Paneles solares</h3>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              className="flex-1"
              label="Ancho:"
              id="solarPanelWidth"
              type="number"
              value={inputSolarPanelWidth}
              disabled={result !== null}
              onChange={(value) => setSolarPanelWidth(value as number)}
            />
            <Input
              className="flex-1"
              label="Alto:"
              id="solarPanelHeight"
              type="number"
              value={inputSolarPanelHeight}
              disabled={result !== null}
              onChange={(value) => setSolarPanelHeight(value as number)}
            />
          </div>
        </div>

        <button
          id="calculateButton"
          type="submit"
          className="btn btn-primary mt-5 sm:mx-auto sm:w-fit min-w-36"
          disabled={
            !(
              inputRoofWidth &&
              inputRoofHeight &&
              inputSolarPanelWidth &&
              inputSolarPanelHeight
            )
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
                    (inputSolarPanelWidth *
                      inputSolarPanelHeight *
                      result.total *
                      100) /
                      (inputRoofWidth * inputRoofHeight)
                )}
                %
              </span>
              .
            </p>
          </div>
          {oppositeResult && oppositeResult.total > result.total && (
            <div className="mt-6 border border-solid border-yellow-500 bg-yellow-100 p-4 flex flex-row gap-3 rounded-sm">
              <ExclamationTriangleIcon className="text-yellow-500 w-6 h-6" />
              <p className="flex-1">
                Si invierte los paneles solares podrían caberle{" "}
                <span className="font-bold">
                  {oppositeResult.total - result.total}
                </span>{" "}
                más y tendría un desperdicio de{" "}
                <span className="font-bold">
                  {roundTwoDecimals(
                    100 -
                      (inputSolarPanelWidth *
                        inputSolarPanelHeight *
                        oppositeResult.total *
                        100) /
                        (inputRoofWidth * inputRoofHeight)
                  )}
                  %
                </span>
                .
              </p>
            </div>
          )}
          {result.total > 0 && (
            <div className="flex flex-col gap-1 mt-6">
              <h2 className="md:text-lg">Visualización</h2>
              <div
                ref={roofElRef}
                className="bg-slate-100 w-full relative text-white"
                style={{ height: viewRoofDimensions.height }}
              >
                {result.items.map((solarPanel, index) => (
                  <div
                    key={index}
                    className="absolute flex justify-center items-center text-center text-sm md:text-base"
                    style={{
                      left:
                        (viewRoofDimensions.width / inputRoofWidth) *
                        solarPanel.left,
                      top:
                        (viewRoofDimensions.height / inputRoofHeight) *
                        solarPanel.top,
                      height:
                        (viewRoofDimensions.height / inputRoofHeight) *
                        solarPanel.height,
                      width:
                        (viewRoofDimensions.width / inputRoofWidth) *
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
