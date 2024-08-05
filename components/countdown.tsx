import { useEffect, useState } from "react";
import PropTypes from "prop-types";

interface CountdownProps {
  targetDate: number;
  hideDays?: boolean;
}

const Countdown = ({
  targetDate,
  hideDays,
}: CountdownProps) => {

  const calculateTimeLeft = () => {
    const nowTime = ( new Date().getTime() / 1000 ) 
    const difference = nowTime > targetDate ? nowTime - targetDate : targetDate - nowTime;
    const days = Math.floor(difference / (60 * 60 * 24));
    const hours = Math.floor(
      (difference % (60 * 60 * 24)) / (60 * 60)
    );
    const minutes = Math.floor((difference % (60 * 60)) / (60));
    const seconds = Math.floor((difference % (60)));

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-[#2e84bd] w-full flex justify-center items-center gap-2 sm:gap-6 mx-auto h-[100px] text-[40px] font-medium">
      {hideDays ? (
        <></>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center bg-white rounded-lg border p-2">
            <p className="text-center">{timeLeft.days}</p>
            <p className="text-[16px] font-normal">Days</p>
          </div>
          {/* <div className="mb-8">
            <p>:</p>
          </div> */}
        </>
      )}

      <div className="flex flex-col justify-center items-center bg-white rounded-lg border p-2">
        <p className="text-center">{timeLeft.hours}</p>
        <p className="text-[16px] font-normal">Hours</p>
      </div>
      {/* <div className="mb-8">
        <p className="">:</p>
      </div> */}
      <div className="flex flex-col justify-center items-center bg-white rounded-lg border p-2">
        <p className="text-center">{timeLeft.minutes}</p>
        <p className="text-[16px] font-normal">Minutes</p>
      </div>
      {/* <div className="mb-8">
        <p className="">:</p>
      </div> */}
      <div className="flex flex-col justify-center items-center bg-white rounded-lg border p-2">
        <p className="text-center">{timeLeft.seconds}</p>
        <p className="text-[16px] font-normal">Seconds</p>
      </div>
    </div>
  );
};

export default Countdown;
