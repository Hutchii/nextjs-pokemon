import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const MultiRangeSlider = ({
  min,
  max,
  minVal,
  maxVal,
  onChange,
}: {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onChange: (e: string, key: string) => void;
}) => {
  // const [minVal, setMinVal] = useState(min);
  // const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  // useEffect(() => {
  //   onChange({ min: minVal, max: maxVal });
  // }, [minVal, maxVal, onChange]);

  return (
    <div>
      <p className="font-medium text-lg mb-1 sm:mb-1.5 lg:mb-2 lg:text-xl">Base experience:</p>
      <div className="slider__bg">
        <div>
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            ref={minValRef}
            onChange={(e) =>
              onChange(
                Math.min(+e.target.value, maxVal - 1).toString(),
                "minExperience"
              )
            }
            className={`thumb thumb--zindex-3
          ${minVal > max - 100 && "thumb--zindex-5"}`}
          />
          <input
            type="range"
            min={min}
            max={max}
            ref={maxValRef}
            value={maxVal}
            onChange={(e) =>
              onChange(
                Math.min(+e.target.value, maxVal + 1).toString(),
                "maxExperience"
              )
            }
            className="thumb thumb--zindex-4"
          />
          <div className="slider">
            <div className="slider__track" />
            <div ref={range} className="slider__range" />
          </div>
        </div>
        <p className="slider__values">
          {minVal} - {maxVal}
        </p>
      </div>
    </div>
  );
};

// MultiRangeSlider.propTypes = {
//   min: PropTypes.number.isRequired,
//   max: PropTypes.number.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

export default MultiRangeSlider;
