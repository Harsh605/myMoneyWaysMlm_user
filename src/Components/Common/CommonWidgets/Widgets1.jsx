import React, { useContext } from "react";
import { Card, CardBody } from "reactstrap";
import { H4 } from "../../../AbstractElements";
import SvgIcon from "../Component/SvgIcon";
import { useState } from "react";
import MyContext from "../../../Context/MyContext";
import Swal from 'sweetalert2'
import { useAccount,useDisconnect } from 'wagmi'
import { buyPackages, updatePackage } from "../../../api/integrateConfig";
import { ABI, BUSDABI, BUSDcontractAddress, contractAddress } from "../../../blockchain";
import { useContractWrite } from 'wagmi'
// const hovertitledata =[
//   {
//     title:'one can purchase this slot only when he was package of $20, $30, $80'
//   }
// ]
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 

const Widgets1 = ({ data }) => {  
  const {userData} = useContext(MyContext);
  const {address} = useAccount();
  const [loading,setLoading] = useState(false);
  const {writeAsync:approve  
  } = useContractWrite({
    abi:BUSDABI,
    address:BUSDcontractAddress,
    functionName:'approve'    
  }) 
  const {writeAsync:buyPackage  
  } = useContractWrite({
    abi:ABI,
    address:contractAddress,
    functionName:'buyPackage'    
  }) 
  const handleSubmit = async (amount) => {  
    try{
      if(amount <= 0 || amount == ""){
        Swal.fire({
          icon:"error",
          text:"Amount must be greater then zero"
        })
      }
      if(!userData){
        Swal.fire({
          icon:"error",
          text:"Please login again"
        })        
      }
      setLoading(true);
      let response = await buyPackages({userId:userData.userId,address,packageType:amount.toString()});
      let amountInWei = Number(amount) * (10**18);
      let appr = await approve({args:[contractAddress,(amountInWei*2).toString()]});
      await sleep(5000);
      let transaction = await buyPackage({args:[response.data.refferAddress,response.data.packageUpdatAddress,amountInWei.toString()]});
      await sleep(5000);
      let apiResponse = await updatePackage({address,refferAddress:response.data.refferAddress,transactionHash:transaction.hash,packageAddress:response.data.packageUpdatAddress,amount,userId:userData.userId})
      setLoading(false);
      if(apiResponse){
        Swal.fire({
          icon:"success",
          text:'Package Buy Successfully'
        })
      }else{
        Swal.fire({
          icon:"error",
          text:"Internel Server Error"
        })
      }
    }catch(err){
      setLoading(false);
      console.log(err);
      if(err?.response?.data?.message){
        Swal.fire({
          icon:"error",
          text:err?.response?.data?.message
        })
      }else if(err?.response?.data?.error){
        Swal.fire({
          icon:"error",
          text:err?.response?.data?.error
        })
      }else if(err.message){
        Swal.fire({
          icon:"error",
          text:err.message
        })
      }        
    }
  }
  return (
    <Card className="widget-1">
      <CardBody>
        <div className="widget-content">
          <div className={`widget-round ${data.color}`}>
            <div className="bg-round">
              <SvgIcon className="svg-fill" iconId={`${data.icon}`} />
              <SvgIcon className="half-circle svg-fill" iconId="halfcircle" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <H4>{data.total}</H4>
            <span className="f-light">
              {loading ? <button className="active-button">Processing...</button>:  <button className="active-button" onClick={()=>handleSubmit(data.gros)}>Active</button>}
            </span>
          </div>
        </div>
        <div className={`font-${data.color} f-w-500`}>
          <i
            className={`icon-arrow-${
              data.gros < 50 ? "down" : "up"
            } icon-rotate me-1`}
          />
          <span>{`${data.gros < 50 ? "-" : "+"}${data.gros}%`}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default Widgets1;
