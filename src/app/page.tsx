import Header from "@/components/header";
import CategoriesSlider from "@/components/categories-slider/CategoriesSlider";
import StrokedText from "@/components/StrokedText/StrokedText";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-items-center min-h-screen sm:px-12 lg:px-50 pb-20 py-8 font-[family-name:var(--font-poppins)]">
        <h2 className="text-3xl text-center font-bold mb-3">
          O que você procura?
        </h2>
        <CategoriesSlider />
        <div className="bg-[url('/bg-banner-novidades.png')] bg-cover bg-center h-50 w-full  sm:rounded-3xl md:rounded-4xl my-6 flex">
          <div className="my-auto sm:m-auto space-y-2 px-6 w-full sm:w-fit">
            <div className="relative w-full sm:w-fit">
              <StrokedText
                size="lg"
                className="font-bold lg:text-3xl text-2xl w-fit"
              >
                Fique por dentro
                <br className="sm:hidden" />
                das novidades!
              </StrokedText>
              <Image
                src={"/bell.png"}
                width={70}
                height={70}
                alt="Imagem de um sino"
                className="absolute right-0 sm:left-full sm:-bottom-1/3 bottom-2 sm:ml-2"
              />
            </div>
            <StrokedText
              size="md"
              className="lg:text-xl text-lg w-full text-right sm:text-left flex justify-end"
            >
              Inovação, qualidade e
              <br className="sm:hidden" />
              compromisso em cada detalhe
            </StrokedText>
          </div>
        </div>
      </main>
    </>
  );
}
