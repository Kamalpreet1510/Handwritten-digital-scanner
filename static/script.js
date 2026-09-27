const input=document.getElementById("imageInput");
const previewSection=document.getElementById("previewSection");
const previewImage=document.getElementById("previewImage");
const recognizeButton=document.getElementById("recognizeButton");
const resultText=document.getElementById("resultText");
const copyButton=document.getElementById("copyButton");
const downloadButton=document.getElementById("downloadButton");
let selectedFile=null;

input.addEventListener("change",()=>{
  selectedFile=input.files[0];
  if(!selectedFile)return;
  if(!["image/jpeg","image/jpg","image/png"].includes(selectedFile.type)){
    alert("Please choose JPG, JPEG or PNG."); input.value=""; return;
  }
  previewImage.src=URL.createObjectURL(selectedFile);
  previewSection.classList.remove("hidden");
  resultText.value="";
});

recognizeButton.addEventListener("click",async()=>{
  if(!selectedFile){alert("Please choose an image first.");return;}
  recognizeButton.disabled=true; recognizeButton.textContent="Processing...";
  const fd=new FormData(); fd.append("image",selectedFile);
  try{
    const res=await fetch("/upload",{method:"POST",body:fd});
    const data=await res.json();
    resultText.value=data.success?data.text:(data.message||"Processing failed.");
  }catch(e){resultText.value="Server connection failed. Make sure app.py is running."}
  recognizeButton.disabled=false; recognizeButton.textContent="🔍 Process Image";
});

copyButton.addEventListener("click",async()=>{
  if(!resultText.value.trim()){alert("No text to copy.");return;}
  await navigator.clipboard.writeText(resultText.value);
  copyButton.textContent="Copied ✓";
  setTimeout(()=>copyButton.textContent="Copy",1200);
});

downloadButton.addEventListener("click",()=>{
  if(!resultText.value.trim()){alert("No text available.");return;}
  const blob=new Blob([resultText.value],{type:"text/plain"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download="recognized-handwriting.txt"; a.click();
  URL.revokeObjectURL(a.href);
});
