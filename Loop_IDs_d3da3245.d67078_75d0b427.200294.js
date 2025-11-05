if (!msg.ingest || msg.ingest.index >= msg.ingest.ids.length){
  return [msg, null];
}
const id = msg.ingest.ids[msg.ingest.index];
msg.detailId = id;
return [null, msg];