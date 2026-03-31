 {/* RECOMENDAÇÕES (Ajustado para Alemão) */}
      <section className="recomendacoes">
        <h2 className="titulo-grid">Produkte, die Ihnen gefallen könnten</h2>
        <div className="grid-produtos">
          {[
            { id: 17, nome: "Handgemachte Tasche Modell A", preco: "25.00", tag: "Bestseller" },
            { id: 18, nome: "Nécessaire Wasserdicht", preco: "19.00", tag: "Neu" }
          ].map((item, index) => (
            <a href="#" key={index} className="card-produto">
              <img src={img17} alt={item.nome} />
              <div className="card-info">
                <span className="card-titulo">{item.nome}</span>
                <div className="card-preco">CHF {item.preco}</div>
                <span className="card-tag">{item.tag}</span>
              </div>
            </a>
          ))}
        </div>
      </section>