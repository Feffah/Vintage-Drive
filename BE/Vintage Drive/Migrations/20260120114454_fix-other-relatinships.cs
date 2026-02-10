using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vintage_Drive.Migrations
{
    /// <inheritdoc />
    public partial class fixotherrelatinships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Shipments",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Shipments_UserId",
                table: "Shipments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shipments_AspNetUsers_UserId",
                table: "Shipments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shipments_AspNetUsers_UserId",
                table: "Shipments");

            migrationBuilder.DropIndex(
                name: "IX_Shipments_UserId",
                table: "Shipments");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Shipments");
        }
    }
}
