import { combine } from "@/data/paramObsBuilders/combine"
import axios from "axios"
import { NextPage } from "next"
import { getStorage, ref } from "firebase/storage"
import { getDownloadURL } from "rxfire/storage"
import { init } from "@/data/initFb"
import { firstValueFrom, from, switchMap } from "rxjs"
import { component } from "@/views/view_builder/component"
import { obsToNamedParamObs } from "@/data/builders/obsToNamedParamObs"
import * as whatsapp from "whatsapp-chat-parser"
import Link from "next/link"
import { buildPrefetchHandler } from "@/views/view_builder/buildPrefetchHandler"
import { Timestamp } from "firebase/firestore"
import moment from "moment"
import Head from "next/head"

const chatLocation = "_chat.txt"

const getPublicUrlObs = (location: string) => {
  init()
  const storage = getStorage()
  const fileRef = ref(storage, `whatsapp_export/${location}`)
  return getDownloadURL(fileRef)
}

const getData = () => {
  const publicUrlObs = getPublicUrlObs(chatLocation)
  const fileText = publicUrlObs.pipe(
    switchMap((url) => {
      console.log("url", url)
      return from(
        axios.get(url).then((resp) => {
          console.log("Res", whatsapp)
          return whatsapp
            .parseString(resp.data as string, {
              parseAttachments: true,
            })
            .then((messages) => {
              return Promise.all(
                messages.map(async (message) => {
                  const newMessage = {
                    ...message,
                    date: Timestamp.fromDate(message.date),
                    firebaseFileUrl: null as string,
                  }
                  const attachmentFilename = message.attachment?.fileName
                  if (attachmentFilename) {
                    newMessage.firebaseFileUrl = await firstValueFrom(
                      getPublicUrlObs(attachmentFilename)
                    )
                  }

                  return newMessage
                })
              )
            })
        })
      )
    })
  )

  return combine({
    messages: obsToNamedParamObs(fileText, "fileText"),
  })
}

const DavidsProposal: NextPage = component(getData, ({ messages }) => {
  // console.log("asdf", messages)
  const messageEls = (
    <div>
      {messages.map((message, i) => {
        const getAttachmentEl = (firebaseUrl: string, fileName: string) => {
          const extension = fileName.split(".").pop()
          let mediaEl = <a href={firebaseUrl}>{fileName}</a>

          if (extension === "jpg") {
            mediaEl = <img className=" max-h-96" src={firebaseUrl} />
          } else if (extension === "mp4") {
            mediaEl = (
              <video className=" max-h-96" src={firebaseUrl} controls></video>
            )
          }
          return <div className="flex justify-center">{mediaEl}</div>
        }

        const lineBreaksReplaced = message.message.replace(/\n/g, "<br />")

        const messageDisplay = message.firebaseFileUrl ? (
          getAttachmentEl(message.firebaseFileUrl, message.attachment.fileName)
        ) : (
          <div
            className=" mb-2 text-lg"
            dangerouslySetInnerHTML={{ __html: lineBreaksReplaced }}
          ></div>
        )

        return (
          <div
            className="mb-3 rounded-2xl rounded-bl-none rounded-tl-xl bg-yellow-50 p-4"
            key={i}
          >
            <div className="mb-3 text-xl font-bold">{message.author}</div>
            {messageDisplay}
            <div className="text-right text-sm text-gray-400">
              {moment(message.date.toMillis()).format("h:mm a")}
            </div>
          </div>
        )
      })}
    </div>
  )
  return (
    <div className="bg-pink-50 p-5">
      <Head>
        <title>David's Proposal To Xinqing!</title>
        <meta
          name="description"
          content="David Proposed to Xinqing on May 29th!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-3">
        <a href={"/"}>
          <div className="underline">Home</div>
        </a>
      </div>
      <div className="flex justify-center">
        <div className="max-w-3xl ">
          <div className=" mb-10 text-center text-2xl font-bold">
            Xinqing's *Secret* Proposal
          </div>
          <div className="mb-5 text-xl">
            For David's proposal to Xinqing he worked with 30 of Xinqing's
            friends and family from around the world to prepare a scavenger
            hunt...in Disney Land! Below is the Whatsapp conversation in which
            the hunt took place.
          </div>
          {messageEls}
        </div>
      </div>
    </div>
  )
})

export const getServerSideProps = buildPrefetchHandler(getData())

export default DavidsProposal
