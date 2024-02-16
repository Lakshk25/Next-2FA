"use client";

// delete account 
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { deleteAccount } from "@/actions/deleteAccount";

interface DeleteButtonProps {
    children?: React.ReactNode;
};
const DeleteAccount = ({
    children
}: DeleteButtonProps) => {
    const onClick = () => {
        deleteAccount()

    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className='p-0 w-auto bg-transparent border-none'>
                <div >
                    <Card>
                        <CardHeader className="p-10">
                            Are you sure you want to delete this account
                        </CardHeader>
                        <CardContent className="flex justify-between">
                            <Button variant="destructive" onClick={onClick}>Delete Account</Button>
                            <DialogClose>
                                <Button >Close</Button>
                            </DialogClose>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAccount