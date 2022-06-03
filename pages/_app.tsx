import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import Sidebar from '../components/Sidebar'
import Layout from '../components/Layout'

const getLibrary = (provider: any) => {
  return new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
     <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>

  )
}

export default MyApp
