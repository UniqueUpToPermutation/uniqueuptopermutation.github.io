import Container from "@/app/_components/container";

const Alert = () => {
  return (
    <div
      className="bg-neutral bg-neutral-800 border-neutral-800 text-white"
    >
      <Container>
        <div className="py-2 text-center text-sm">
          (
            <>
              This website is currently under construction. Pardon my dust.
            </>
          )
        </div>
      </Container>
    </div>
  );
};

export default Alert;
