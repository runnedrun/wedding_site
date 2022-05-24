import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import widePic from "images/xq-david-wide.jpg"
import yesPic from "images/xq-david-1.jpg"
import noPic from "images/xq-david-2.jpg"
import Link from "next/link"

const Page = () => {
  const opening = (
    <div>
      <div className="mt-5 mb-10 p-5">
        <div className="text-2xl">
          Xinqing and David are getting married on:
        </div>
        <div className=" text-5xl">Saturday August 6th!</div>
      </div>
      <Image
        className="mt-10 mb-10 object-cover"
        height={500}
        width={500}
        src={widePic}
      ></Image>

      <div className="p-5">
        Well, actually, we're getting married on{" "}
        <a
          className="text-red-400"
          href="https://www.chinahighlights.com/festivals/double-seventh-festival.htm"
          target="_blank"
        >
          Thursday August 4th
        </a>
        , at the courthouse.
      </div>
      <div className="p-5 text-3xl">
        But we're having our party on August 6th!
      </div>
    </div>
  )

  const rsvpSelectionSection = (
    <div className="mt-5 flex flex-col items-center">
      <div className="text-2xl">We'd love for you to be there!</div>
      <div>Select one of these two options to RSVP:</div>
      <div className="mt-10 mb-10 flex flex-wrap justify-center">
        <Link href={"/rsvp"}>
          <div className="mb-5 cursor-pointer">
            <Image
              height={400}
              width={400}
              objectFit="contain"
              src={yesPic}
            ></Image>
          </div>
        </Link>

        <Link href={"/regrets"}>
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
    <div className="h-full">
      <Head>
        <title>Xinqing and David's Wedding!</title>
        <meta
          name="description"
          content="We're getting married, and you're invited!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page></Page>
    </div>
  )
}

export default Home
