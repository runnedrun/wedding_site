import { NextPage } from "next"
import Head from "next/head"

const prefix =
  "https://storage.googleapis.com/xinqing-david-wedding.appspot.com/xinqing_proposal/"

const XinqingsProposal: NextPage = () => {
  return (
    <div className="bg-pink-50 p-5">
      <Head>
        <title>Xinqing's Proposal to David!</title>
        <meta
          name="description"
          content="Xinqing proposed to David on April 3rd!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-3">
        <a href={"/"}>
          <div className="underline">Home</div>
        </a>
      </div>
      <div className="flex flex-col items-center">
        <div className="max-w-3xl">
          <div className=" mb-5 mt-5 text-3xl">Xinqing's Proposal To David</div>
          <div className="mb-5 text-lg">
            For Xinqing's secret proposal to David, she booked a Karaoke room,
            knowing that David looooooves singing! She chose four of their
            favorite songs (Love Story, Rewrite the Stars, You'll be back,
            今天你要嫁给我) and changed the lyrics to tell the love story of
            Xinqing and David. She also invited all of David's family and
            friends abroad to witness this special moment online!
          </div>
          <div className="mb-5 text-lg">
            The proposal was a huge surprise to David. He thought the whole time
            that the Karaoke party is a birthday party for a friend, and had
            absolutely no idea (and he was actually 20 minutes late to the
            party, leaving me and everyone in the room and online waiting
            nervously for more than half an hour!)
          </div>

          <div className="mb-5 text-lg">
            Watch the entire proposal video here and the best photos too!
          </div>

          <div className="mb-3 text-lg">Recording of the whole proposal:</div>

          <video
            className="mb-5"
            src={`${prefix}compressed_proposal_recording.mp4`}
            controls
          ></video>

          <div className="mb-3 text-lg">Background Video with lyrics</div>

          <video
            className="mb-5"
            src={`${prefix}compressed_background_video.mp4`}
            controls
          ></video>

          <div className="mb-3 text-lg">Xinqing Practicing beforehand</div>

          <video
            className="mb-3"
            src={`${prefix}xinqing_practicing.mp4`}
            controls
          ></video>

          <div className="mb-3 text-lg">Pics from the after party!</div>
          <img className="mb-3" src={`${prefix}xq_proposal_group.jpeg`}></img>
          <img className="mb-3" src={`${prefix}after_pics.jpeg`}></img>
          <img className="mb-3" src={`${prefix}lego_marry_me.jpeg`}></img>
        </div>
      </div>
    </div>
  )
}

export default XinqingsProposal
