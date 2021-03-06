import type { GetStaticProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import Image from "next/image";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import Pagination from "@/components/UI/Pagination";
import { generateCountPercent } from "@/utils/generateCountPercent";

const pageSize = 10;

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
  place: number;
}> = ({ pokemon, place }) => {
  return (
    <div className="flex border-b border-violet-400 border-opacity-20 p-2 items-center justify-between text-base sm:text-xl text-violet-100 gap-1">
      <div className="flex items-center gap-4 sm:gap-6 drop-shadow-[0_0_100px_#3700ffb9]">
        <p className="text-gray-100 bg-gradient-to-r from-indigo-800 to-violet-800 w-7 h-7 flex items-center justify-center text-base">
          {place}
        </p>
        <div className="w-12 sm:w-16">
          <Image
            src={pokemon.spriteUrl}
            alt="Pokemon"
            width={64}
            height={64}
            layout="responsive"
          />
        </div>
        <p className="capitalize whitespace-pre-line">{pokemon.name}</p>
      </div>
      <p className="capitalize text-gray-400 drop-shadow-[0_0_100px_#8400ffd6]">
        {generateCountPercent(pokemon).toFixed(2) + "%"}
      </p>
    </div>
  );
};

const Results: React.FC<{
  pokemon: PokemonQueryResult;
}> = ({ pokemon }) => {
  const [page, setPage] = useState(1);
  const totalCount = pokemon.length;
  const currentPage = page;
  const pagination = usePagination({
    totalCount,
    pageSize,
    currentPage,
  });
  let lastPage = pagination?.at(-1) === page;
  return (
    <main className="md:flex md:flex-col md:items-center px-5 sm:px-10 2xl:px-20 4xl:px-40 pb-20">
      <h1 className="text-center leading-normal mt-10 sm:mt-20 text-3xl sm:text-4xl lg:text-5xl mb-8 sm:mb-12 lg:mb-20 font-bold animate-fade-in">
        Voting
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
          {" "}
          results
        </span>
      </h1>
      <div className="bg-[#111111de] rounded-3xl w-full md:max-w-2xl font-semibold px-4 py-2 animate-fade-in">
        {pokemon
          .sort((a, b) => {
            const difference =
              generateCountPercent(b) - generateCountPercent(a);
            if (difference === 0) {
              return b._count.VoteFor - a._count.VoteFor;
            }
            return difference;
          })
          .map((p, index) => (
            <PokemonListing pokemon={p} key={p.name} place={index + 1} />
          ))
          .slice((page - 1) * 10, page * 10)}
      </div>
      {!pagination || pagination.length < 2 ? null : (
        <Pagination
          onArrowClick={(sign: number = 0) => setPage((p) => p + sign)}
          onPageClick={(page: number) => setPage(page)}
          lastPage={lastPage}
          paginationRange={pagination}
          currentPage={page}
        />
      )}
    </main>
  );
};

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
    orderBy: { VoteFor: { _count: "desc" } },
  });
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

export default Results;
