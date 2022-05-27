import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import widePic from "images/xq-david-wide.jpg"
import yesPic from "images/xq-david-1.jpg"
import noPic from "images/xq-david-2.jpg"
import Link from "next/link"
import randomWords from "random-words"
import Banner1 from "images/banner_1.png"
import Photo1 from "images/photo_1.png"

const Page = () => {
  const opening = (
    <div>
      <div className="flex flex-col items-center">
        <div className="mt-5 flex justify-center">
          <Image src={Banner1}></Image>
          {/* <div className="text-2xl">
            Xinqing and David are getting married on:
          </div>
          <div className=" text-5xl">Saturday August 6th!</div> */}
        </div>

        <Image
          className="mt-10 mb-10 object-contain"
          height={650}
          width={650}
          src={Photo1}
        ></Image>
      </div>

      <div className="p-5 text-center">
        Well, actually, we're getting married on{" "}
        <a
          className="text-red-400"
          href="https://www.chinahighlights.com/festivals/double-seventh-festival.htm"
          target="_blank"
          rel="noreferrer"
        >
          Thursday August 4th
        </a>
        , at the courthouse.
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-5 text-center text-3xl">
          But we're having a party on August 6th!
        </div>
        <div className=" mr-5 ml-5 max-w-md border-2 border-solid p-2">
          <div className="text-lg">
            <span className="font-bold">Time:</span> 3-7PM
          </div>
          <div className="text-lg">
            <span className="font-bold">Venue:</span> David's Parents' house —
            3507 Foster Ave, Baltimore, MD, 21224
          </div>
        </div>
      </div>
    </div>
  )

  const rsvpSlug = [randomWords(), randomWords()].join("-")

  const rsvpSelectionSection = (
    <div className="mt-5 flex flex-col items-center">
      <div className="text-2xl">We'd love for you to be there!</div>
      <div>Select one of these two options to RSVP:</div>
      <div className="mt-10 mb-10 flex flex-wrap justify-center">
        <Link href={`/rsvp/${rsvpSlug}?startEditing=true`}>
          <div className="mb-5 cursor-pointer">
            <Image
              height={400}
              width={400}
              objectFit="contain"
              src={yesPic}
            ></Image>
          </div>
        </Link>

        <Link href={`/regrets/${rsvpSlug}?startEditing=true`}>
          <div className="cursor-pointer">
            <Image
              height={400}
              width={400}
              objectFit="contain"
              src={noPic}
            ></Image>
          </div>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="flex w-full flex-col items-center">
      {opening}
      {rsvpSelectionSection}
    </div>
  )
}

const Home: NextPage = () => {
  return (
    <div className=" bg-pink-50">
      <Head>
        <title>Xinqing and David's Wedding!</title>
        <meta
          name="description"
          content="We're getting married, and you're invited!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page></Page>
      <div className="p-5 text-center text-sm">
        Made with <span className="text-red-400">❤️</span> by Xinqing and David
      </div>
    </div>
  )
}

export default Home
