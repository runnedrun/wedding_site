import React from "react"

interface ProfilePhotoSelectorProps {
  name?: string
  buttonText?: string
  title?: string
  id?: string
  photoUrl?: string
  changeProfilePhoto: React.ChangeEventHandler<HTMLInputElement>
}

export const exampleProps: ProfilePhotoSelectorProps = {
  name: "uploadFile",
  buttonText: "Change",
  title: "Photo",
  id: "uploadFile",
  changeProfilePhoto: () => {},
}

export const ProfilePhotoSelector = ({
  name,
  buttonText,
  title,
  id,
  photoUrl,
  changeProfilePhoto,
}: ProfilePhotoSelectorProps) => {
  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="photo"
        className="block text-sm font-medium text-gray-700"
      >
        {title}
      </label>
      <div className="flex items-center mt-1">
        <span className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
          {photoUrl && <img className="w-12" src={photoUrl}></img>}
        </span>

        <label htmlFor={id}>
          <span className="px-3 py-2 ml-5 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {buttonText}
          </span>
          <input
            id={id}
            name={name}
            type="file"
            className="sr-only"
            onChange={changeProfilePhoto}
          />
        </label>
      </div>
    </div>
  )
}
