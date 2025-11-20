import Link from "next/link";
import Image from "next/image";
import { cn, getSubjectColor } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "./ui/table";

interface Companion {
  id: string;
  subject: string;
  name: string;
  topic: string;
  duration: number;
  color: string;
  sessionId?: string; // Optional session ID for unique keys
}

interface CompanionListProps {
  title: string;
  Companions: Companion[];
  className?: string;
}

const CompanionList = ({title, Companions, className}: CompanionListProps) => {
  return (
    <article className={cn("companion-list", className)}>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="border-2 border-black rounded-lg overflow-hidden">
        <Table className="bordered-table">
          <TableCaption className="sr-only">A list of your recent sessions</TableCaption>
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="text-lg w-2/3 border-0">Lessons</TableHead>
              <TableHead className="text-lg border-0">Subject</TableHead>
              <TableHead className="text-lg text-right border-0">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Companions?.filter(companion => companion && companion.id).map(({id, subject, duration, name, topic, sessionId}, index) => (
              <TableRow key={sessionId || `${id}-${index}`} className="border-0 hover:bg-transparent">
                <TableCell className="border-0">
                  <Link href={`/companions/${id}`}>
                    <div className="flex items-center gap-2">
                      <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject) }}> 
                        <Image 
                          src={`/icons/${subject || 'default'}.svg`} 
                          alt={subject || 'Companion icon'}
                          width={35} 
                          height={35}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-2xl font-bold">{name}</p>
                        <p className="text-lg">{topic}</p>
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="border-0">
                  <span className="subject-pill bg-black text-white rounded-full px-[18px] py-1 text-sm font-medium inline-block capitalize">
                    {subject}
                  </span>
                </TableCell>
                <TableCell className="border-0">
                  <div className="flex items-center justify-end gap-2 w-full">
                    <p className="text-2xl">{duration} <span className="max-md:hidden">mins</span></p>
                    <Image 
                      src="/icons/clock.svg" 
                      alt="duration"
                      width={14} 
                      height={14} 
                      className="md:hidden"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </article>
  )
}

export default CompanionList
