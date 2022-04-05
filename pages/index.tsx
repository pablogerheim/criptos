import Head from "next/head";
import styled from "styled-components";
import { useEffect, useState } from "react";
//import Image from 'next/image'

const StyledDiv = styled.div`
margin: 20px;
display: block;
background-color: rgba(230, 230, 230);
padding: 15px;
border-radius: 15px;
`;

const StyledImg = styled.img` 
width: 60px;
height: 60px;
margin: 20px 20px 15px 10px;
`;
const StyledDivImg = styled.div`
display:flex;
align-items: center;
font-weight: bold;
`;

const StyledButton = styled.button`
padding: 10px 10px ;
margin: 5px 15px 0px 15px;
border: 1px solid black;
border-radius:5px ;
background-color: rgba(250, 250, 250);
`;
const StyledDivB = styled.div`
display:flex;
padding: 5px;
justify-content: space-between;
`;

const StyledImput = styled.input`
padding: 10px 15px ;
border: 1px solid black;
border-radius:5px ;
width: 90% ;
align-items: center;
margin: 15px 0px 5px 0px;
background-color: rgba(250, 250, 250);
`;
const StyledDivIput = styled.div`
display:flex;
flex-direction: column;
align-items: center;
`;

const StyledP = styled.p`
display: flex;
font-size: medium;
margin: 0px 0px 5px 10px;
`;
const StyledPp = styled.p`
margin: 0px 0px 0px 2px;
font-weight: bold;
`;

export function Cripto() {
  const [page, setPage] = useState<number>(1)
  const [html, setHtml] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [numI, setNumI] = useState<number>(0)

  useEffect(() => {
    handleHTML(page.toString(), search.toLowerCase())
  }, [page, search])

  function handleBR() {
    setSearch("")
    setPage(page + 1)
  }
  function handleBL() {
    setSearch("")
    if (page === 0) { setPage(1) }
    else setPage(page - 1)
  }
  function handleS(params: any) {
    setPage(0)
    setSearch(params)
  }

  async function handleHTML(page: string, search: string) {
    let newdata: any;
    if (search === '') {
      let data = await fetch(`https://api.coingecko.com/api/v3/exchanges/?per_page=100&page=${page}`).then((res) => res.json());
      newdata = data
      handleBS("L")
      handleBS("R")
    } else {
      let data = await fetch(`https://api.coingecko.com/api/v3/exchanges/?per_page=100&page=${page}`).then((res) => res.json());
      newdata = data.filter((item: any) => item.name.toLowerCase().includes(search))
      handleBS("L")
      handleBS("R")
      setNumI(newdata.length)
    }

    let content = newdata.map((item: any) => (
      <StyledDiv>
        <StyledDivImg>
          <StyledImg src={item.image} />
          {item.name}
        </StyledDivImg>
        <div >
          <StyledP >Ano da criação: <StyledPp> {item.year_established}</StyledPp></StyledP>
          <StyledP >Pais: <StyledPp> {item.country}</StyledPp></StyledP>
          <StyledP >Pontuação: <StyledPp> {item.trust_score}</StyledPp></StyledP>
          <StyledP >Volume de trade (24 horas): <StyledPp> {item.trade_volume_24h_btc}</StyledPp></StyledP>
        </div>
      </StyledDiv>
    ))
    setHtml(content)
  }

  function handleBS(B: string) {
    let BL: boolean
    let BR: boolean

    if (search != '') { BL = false, BR = false }
    else if (page == 1) { BL = true, BR = false }
    else if (html.length < 100) { BL = false, BR = true }
    else { BL = false, BR = false }

    if (B == "L") { return BL }
    else return BR
  }

  return (
    <div >
      <StyledDivB>
        <StyledButton disabled={handleBS("L")} onClick={handleBL} >Pagina Anterior</StyledButton>
        <StyledButton disabled={handleBS("R")} onClick={handleBR} >Próxima Pagina</StyledButton>
      </StyledDivB>
      <StyledDivIput>
        <StyledImput onChange={(evt) => { handleS(evt.target.value) }} value={search} placeholder="Filtre por nome" />
      </StyledDivIput>
      {search === '' ? "" : <p>Exibindo: {numI} de 100</p>}
      {html}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next | Cripto</title>
        <meta name="description" content="Random user generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Cripto />
    </div>
  );
}
