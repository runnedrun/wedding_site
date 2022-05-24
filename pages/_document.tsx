import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.Userback = window.Userback || {
              after_send: (data) => {
                window.Userback.afterSend && window.Userback.afterSend(data)                
              }
            };
            Userback.access_token = '34074|65359|H37i8NVhsPQcO53FfHGnOCPnY';
            (function(d) {
                var s = d.createElement('script');s.async = true;
                s.src = 'https://static.userback.io/widget/v1.js';
                (d.head || d.body).appendChild(s);
            })(document);
          `,
          }}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
