export const sendVerificationEmail = async(email:string, token:string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
    return confirmLink;
}