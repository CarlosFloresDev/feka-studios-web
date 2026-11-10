import AtmosphericScene from '../components/AtmosphericScene';
export default function VacasScene({art, active, reduced}: {art:string; active:boolean; reduced:boolean}) {
  return <AtmosphericScene image={`/media/vacas/${art}`} active={active} reduced={reduced} />;
}
