import Card from "@/custom-components/Card";
import React from "react";
import { useSelector } from "react-redux";

const FeaturedAuctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  return (
    <>
      <section className="my-8">
        <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
          Featured Auctions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allAuctions.slice(0, 8).map((element) => (
            <Card
              key={element._id}
              title={element.title}
              imgSrc={element.image?.url}
              startTime={element.startTime}
              endTime={element.endTime}
              startingBid={element.startingBid}
              id={element._id}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default FeaturedAuctions;
