"use client";

import useSWR from "swr";
import fetchImages from "@/lib/fetchImages";
import Image from "next/image";

type ImageType = {
  name: string;
  url: string;
};

export default function Images() {
  const {
    data: images,
    isLoading,
    mutate: refreshImages,
    isValidating,
  } = useSWR("images", fetchImages, { revalidateOnFocus: false });

  return (
    <div>
      {/* https://swr.vercel.app/docs/mutation#bound-mutate 
        update the local data immediately and revalidate (refetch)
        NOTE: key is not required when using useSWR's mutate as it's pre-bound
      */}
      {/* Optimistic Updates 要在 call mutate function 的時候傳入舊的 data 做為參數 */}
      <button onClick={() => refreshImages(images)}
      className="fixed bottom-10 right-10 bg-violet-400/90 text-white px-5 py-3 rounded-md hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 font-bold z-20"
      >
        {!isLoading && isValidating ? "Refreshing..." : "Refresh Images"}
      </button>
      {isLoading && (
        <p className="animate-pulse text-center pb-7 font-extralight">
          Loading <span className="text-violet-400">AI</span> Generated
          Images...
        </p>
      )}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-0 md:px-10">
        {images?.imageUrls?.map((image: ImageType, i: number) => (
          <div
            key={image.name}
            className={`relative cursor-help
            ${i === 0 && "md:col-span-2 md:row-span-2"}
            hover:scale-[103%] transition-transform duration-200 ease-in-out
            `}
          >
            {/* create a white div that when hovered it appears */}
            <div className="absolute flex justify-center items-center w-full h-full bg-white opacity-0 hover:opacity-80 transition-opacity duration-200 z-10">
              <p className="text-center font-light text-lg p-5">
                {/* This removes the Timestamp and File extension */}
                {image.name.split("_").shift()?.toString().split(".").shift()}
              </p>
            </div>
            <Image
              src={image.url}
              alt={image.name}
              height={800}
              width={800}
              className="w-full rounded-sm shadow-2xl drop-shadow-lg -z-10"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
