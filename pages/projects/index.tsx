import ViewLayout from "../../components/nav/ViewLayout";
import useApi from "../../hooks/useApi";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectAuthUserState} from "../../store/slices/auth.slice";
import {ProjectModel} from "../../models/project.model";
import {Avatar, Skeleton} from "@chakra-ui/react";
import {formatDate} from "../../utils/date";
import { AiOutlinePlus } from "react-icons/ai";
import {useRouter} from "next/router";

export default function ProjectsHome() {
    const api = useApi();
    const router = useRouter();
    const authUser = useSelector(selectAuthUserState);
    const [projects, setProjects] = React.useState<ProjectModel[]>([]);
    const [isPageLoading, setIsPageLoading] = useState(true);

    React.useEffect(() => {
        if (authUser._id && projects.length == 0) {
            api.getProjects()
                .then((data) => {
                    console.log(data);
                    setProjects(data);
                }).finally(() => {
                    setIsPageLoading(false);
            });
        }
    }, [authUser]);


    return(
        <ViewLayout pageTitle={'Projects'}>
            <h1 className="font-bold md:text-3xl mb-6">Projects</h1>
            {isPageLoading ?
                <PageLoadingSchema /> :
                (<div className="body md:flex">
                    {
                        projects.map((project, index) => {
                            return (
                                <div key={index} onClick={() => router.push(`/projects/${project.id}/dashboard`)} className="border cursor-pointer w-full md:w-1/4 rounded min-h-100 md:mr-4 mb-4 px-4 py-3">
                                    <div className="flex items-center gap-1 mb-3">
                                        <Avatar size={'sm'} colorScheme={'teal'} name={project.name} />
                                        <p className="font-semibold text-lg">{project.name}</p>
                                    </div>
                                    <p className="m-0 text-slate-500 text-sm">{formatDate(project.createdAt)}</p>
                                </div>
                            )
                        })
                    }
                    <div className="border w-full md:w-1/3 xl:w-24 cursor-pointer text-slate-500 rounded border-dotted min-h-100 flex items-center justify-center md:mr-4 mb-4 px-4 py-3">
                        <AiOutlinePlus size={32} />
                    </div>
                </div>)
            }
        </ViewLayout>
    )
}

function PageLoadingSchema() {
    return (
        <div className={''}>
            <div className="row mb-10">
                <div className="col-sm-4">
                    <Skeleton height={'105px'} />
                </div>
                <div className="col-sm-4">
                    <Skeleton height={'105px'} />
                </div>
                <div className="col-sm-4">
                    <Skeleton height={'105px'} />
                </div>
            </div>
        </div>
    )
}