"use client";

export default function CargandoPedido() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="loader-dog">
        <div className="loader-dog__paws">
          <div className="loader-dog__bl-leg loader-dog__leg">
            <div className="loader-dog__bl-paw loader-dog__paw" />
            <div className="loader-dog__bl-top loader-dog__top" />
          </div>
          <div className="loader-dog__fl-leg loader-dog__leg">
            <div className="loader-dog__fl-paw loader-dog__paw" />
            <div className="loader-dog__fl-top loader-dog__top" />
          </div>
          <div className="loader-dog__fr-leg loader-dog__leg">
            <div className="loader-dog__fr-paw loader-dog__paw" />
            <div className="loader-dog__fr-top loader-dog__top" />
          </div>
        </div>
        <div className="loader-dog__body">
          <div className="loader-dog__tail" />
        </div>
        <div className="loader-dog__head">
          <div className="loader-dog__snout">
            <div className="loader-dog__eyes">
              <div className="loader-dog__eye-l" />
              <div className="loader-dog__eye-r" />
            </div>
          </div>
        </div>
        <div className="loader-dog__head-c">
          <div className="loader-dog__ear-r" />
          <div className="loader-dog__ear-l" />
        </div>
      </div>
    </div>
  );
}
