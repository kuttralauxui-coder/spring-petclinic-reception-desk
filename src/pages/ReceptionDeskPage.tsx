import { ReceptionDeskPresenter } from '../components/reception/ReceptionDeskPresenter';
import { useReceptionDesk } from '../hooks/useReceptionDesk';

export default function ReceptionDeskPage() {
  const model = useReceptionDesk();
  return <ReceptionDeskPresenter {...model} />;
}
