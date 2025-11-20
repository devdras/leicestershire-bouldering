const InfoPiece = ({ title, info }: { title: string; info: string }) => {
  return (
    <>
      {info && (
        <div className="">
          <p className="font-bold">{title}</p>
          <p>{info}</p>
        </div>
      )}
    </>
  );
};
export default InfoPiece;
